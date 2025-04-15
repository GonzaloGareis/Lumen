import { NextResponse } from 'next/server';
import { createPatient } from '@/lib/patientService';
import { auth } from '@clerk/nextjs/server';
import { getPatientsByUserIdWithToken } from "@/lib/patientService";

export async function POST(req: Request) {

  const cookie = req.headers.get("cookie") || "";
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }


  const body = await req.json();

  const result = await createPatient({
    ...body,
    user_id: userId, // Inject user_id securely
  });

  return NextResponse.json(result);
}


export async function GET(req: Request) {
  // Pass the cookie header so Clerk can properly extract the session
  const cookie = req.headers.get("cookie") || "";
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  
  // Use a token template (configure your Clerk dashboard accordingly)
  const token = await getToken({ template: "supabase" });
  if (!token) {
    return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
  }
  
  try {
    const data = await getPatientsByUserIdWithToken(userId, token);
    return NextResponse.json(data);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
