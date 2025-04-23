import { createClientWithToken } from "@/lib/supabaseClient";


export interface PatientData {
  name: string,
  age: number,
  contact: string,
  family_reference: string,
  comments: string,
  created_at: Date
}

export async function updatePatient(
  patientId: string,
  userId: string,
  updateData: Partial<Omit<PatientData, 'created_at' | 'user_id'>>,
  token: string
) {
  
  const client = createClientWithToken(token);
  const { data, error } = await client
    .from("patients")
    .update(updateData)
    .eq("id", patientId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}


export async function deletePatient(
  patientId: string,
  userId: string,
  token: string
) {
  const client = createClientWithToken(token);
  const { data, error } = await client
    .from("patients")
    .delete()
    .eq("id", patientId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}


export async function createPatientWithToken(
  patientData: PatientData, 
  userId: string, 
  token: string
) {

  const client = createClientWithToken(token);
  const { data, error } = await client
    .from("patients")
    .insert([{user_id: userId, ...patientData}])
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