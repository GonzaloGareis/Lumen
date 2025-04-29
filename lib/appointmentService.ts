import { createClientWithToken } from "@/lib/supabaseClient";
import { UUID } from "crypto";


export interface SingleAppointmentData {
    patient_id: UUID;
    date: Date,
    notes: string,
  }

export interface AppointmentWithPatient {
    id: string;
    patient_id: string;
    date: string;
    notes: string | null;  
    patient_name: string;
  }

  export interface RecurrenceSettings {
    interval: number;
    frequency: "day" | "week" | "month";
    weekdays?: number[];
    endOption: "never" | "onDate" | "afterCount";
    endDate?: string;
    occurrenceCount?: number;
  }
  
  export interface RecurringAppointmentData {
    patient_id: string;
    date: string;               // ISO timestamp of first appointment
    recurrence: RecurrenceSettings;
  }
  
  export interface AppointmentSeries {
    id: UUID;
    user_id: string;
    patient_id: string;
    interval: number;
    frequency: string;
    first_appointment_time: string;
    max_count: number | null;
    valid_until: string | null;
    weekdays: number[] | null;
    created_at: string;
  }


  // Creates a new appointment record in the 'appointments' table.
export async function createSingleOccurrenceAppointmentWithToken(appointmentData: SingleAppointmentData , userId: string, token: string) {
    const { ...insertData } = appointmentData;

    const client = createClientWithToken(token);
  
    const { data, error } = await client
      .from("appointments")
      .insert([{user_id: userId, ...insertData}])
      .single();
  
    if (error) {
      return { error: error.message };
    }
  
    return data;
  }



export async function getAppointmentsByUserIdWithToken(
    userId: string,
    token: string
  ): Promise<AppointmentWithPatient[]> {

    const client = createClientWithToken(token);
  
    // Select all appointment fields + the patient's name from patients table
    const { data, error } = await client
      .from("appointments")
      .select(`
        id,
        patient_id,
        date,
        notes,
        patients (
          name
        )
      `)
      .eq("user_id", userId);
  
    if (error) {
      throw new Error(error.message);
    }
  
    // Flatten the nested patients.name into patient_name
    return (data || []).map((row: any) => ({
      id: row.id,
      patient_id: row.patient_id,
      date: row.date,
      notes: row.notes,
      patient_name: row.patients.name,
    }));
  }


  export async function createRecurringAppointmentWithToken(
    seriesData: RecurringAppointmentData,
    userId: string,
    token: string
  ): Promise<AppointmentSeries | { error: string }> {

    const client = createClientWithToken(token);
  
    const {
      patient_id,
      date,
      recurrence: { interval, frequency, weekdays, endOption, endDate, occurrenceCount },
    } = seriesData;
  
    // build series insert payload
    const seriesInsert: Partial<AppointmentSeries> = {
      user_id: userId,
      patient_id,
      interval,
      frequency,
      first_appointment_time: date,
      weekdays: frequency === "week" ? weekdays ?? [] : null,
      valid_until: endOption === "onDate" ? endDate! : null,
      max_count: endOption === "afterCount" ? occurrenceCount! : null,
    };
  
    // 1) create the series record
    const { data, error} = await client
      .from("appointment_series")
      .insert(seriesInsert)
  
    if (error) {
      return { error: error.message || "Could not create series" };
    }
  
    // 2) create the first appointment occurrence
    const { data: firstAppointment, error: apptError } = await client
      .from("appointments")
      .insert([
        {
          user_id: userId,
          patient_id,
          date,
        },
      ])
      .single();
  
    if (apptError) {
      return { error: apptError?.message || "Could not create first appointment" };
    }

    const { data: series, error: fetchError } = await client
    .from("appointment_series")
    .select("*")
    .eq("user_id", userId)
    .eq("first_appointment_time", date)
    .limit(1)
    .single();

    if (fetchError) {
      return { error: fetchError.message || "Could not retreive created series" };
    }
    
    return { ...series };
  }


  export async function createOccurrencesForSeries(
    series: AppointmentSeries,
    token: string
  ){

    const client = createClientWithToken(token);

    const {
      id: seriesId,
      user_id,
      patient_id,
      interval,
      frequency,
      first_appointment_time,
      max_count: max_count,
      valid_until,
      weekdays,
    } = series;

    const firstDate = new Date(first_appointment_time);

    let endDate: Date;

    if (valid_until) {
      endDate = new Date(valid_until);
    }else {
      endDate = new Date(firstDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const dates: Date[] = [];

    function tryPush(d: Date) {
      if (d <= endDate) {
        dates.push(new Date(d));
      }
    }

    if (frequency === "week") {

      let weekStart = new Date(firstDate);
      // align weekStart to the beginning of that week interval
      weekStart.setHours(firstDate.getHours(), firstDate.getMinutes(), 0, 0);
  
      while (weekStart <= endDate && (!max_count || dates.length < max_count)) {
        for (const wd of weekdays || []) {
          const occ = new Date(weekStart);
          const diff = wd - occ.getDay();
          occ.setDate(occ.getDate() + diff);

          if (occ >= firstDate) {
            tryPush(occ);
            if (max_count && dates.length >= max_count) break;
          }
        }
        weekStart.setDate(weekStart.getDate() + interval * 7);
      }
    }
    else if (frequency === "month") {
      // for monthly: same day-of-month
      let m = new Date(firstDate);
      while (m <= endDate && (!max_count || dates.length < max_count)) {
        if (m >= firstDate) tryPush(m);
        m = new Date(m);
        m.setMonth(m.getMonth() + interval);
      }
    }

    const firstTime = firstDate.getTime();

    let skipped = false;
    const occurrences = dates
    .sort((a, b) => a.getTime() - b.getTime())
    .filter(d => {
      if (!skipped && d.getTime() === firstTime) {
        skipped = true;
        return false;
      }
      return true;
    });
  
    const toInsert = occurrences.map((d) => ({
    user_id,
    patient_id,
    date: d.toISOString()
    }));

    const { data, error } = await client
    .from("appointments")
    .insert(toInsert);

    if (error) {
      return { error: error.message };
    }
  }