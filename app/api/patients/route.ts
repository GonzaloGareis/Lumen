import { NextResponse } from 'next/server';
import { createPatientWithToken } from '@/lib/patientService';
import { auth } from '@clerk/nextjs/server';
import { getPatientsByUserIdWithToken } from "@/lib/patientService";
import { exchangeToken } from '@/lib/tokenService';


export async function POST(req: Request) {

  // Passing the cookie header so Clerk can properly extract the session. Even tho it's not used clerk reads it by context
  const cookie = req.headers.get("cookie") || "";
  const { userId, getToken } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const clerkToken = await getToken({ template: "supabase" });
  if (!clerkToken) {
    return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
  }
  
  const body = await req.json();

  const host = req.headers.get("host");
  if (!host) {
    throw new Error("Missing host header");
  }

  try {
    const supabaseToken = await exchangeToken(host, clerkToken);    
    const result = await createPatientWithToken(body, userId, supabaseToken)
    return NextResponse.json(result);
    
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}


export async function GET(req: Request) {
  
  const cookie = req.headers.get("cookie") || "";
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  
  const clerkToken = await getToken({ template: "supabase" });
  if (!clerkToken) {
    return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
  }
  
    const host = req.headers.get("host");
    if (!host) {
      throw new Error("Missing host header");
    }

    try {
      const supabaseToken = await exchangeToken(host, clerkToken);
      const data = await getPatientsByUserIdWithToken(userId, supabaseToken);
      return NextResponse.json(data);

    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
    }
}
