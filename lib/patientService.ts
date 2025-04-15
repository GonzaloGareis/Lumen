import { createClientWithToken } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseClient";

// Define the expected types for patient and appointment records.
// You can extend these interfaces to match your table schema precisely.
export interface PatientData {
  user_id: string,
  name: string,
  age: number,
  contact: string,
  family_reference: string,
  comments: string,
  created_at: Date
}


// Creates a new patient record in the 'patients' table.
export async function createPatient(patientData: PatientData) {
  const { data, error } = await supabaseAdmin
    .from("patients")
    .insert([patientData])
    .single();

  if (error) {
    return { error: error.message };
  }

  return data;
}


export async function getPatientsByUserIdWithToken(userId: string, token: string) {
    const client = createClientWithToken(token);
    const { data, error } = await client
      .from("patients")
      .select("*")
      .eq("user_id", userId);
      
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }