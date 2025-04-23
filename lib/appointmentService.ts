import { createClientWithToken, supabaseAdmin } from "@/lib/supabaseClient";
import { UUID } from "crypto";


export interface AppointmentData {
    user_id: string;
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


  // Creates a new appointment record in the 'appointments' table.
export async function createAppointment(appointmentData: AppointmentData) {
    const { ...insertData } = appointmentData;
  
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .insert([insertData])
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