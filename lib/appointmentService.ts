import { supabaseAdmin } from "@/lib/supabaseClient";


export interface AppointmentData {
    user_id: string;
    date: Date,
    notes: string,
    created_at: Date
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