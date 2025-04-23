import { NextResponse } from 'next/server';
import { createPatientWithToken } from '@/lib/patientService';
import { auth } from '@clerk/nextjs/server';
import { getPatientsByUserIdWithToken } from "@/lib/patientService";


export async function POST(req: Request) {

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
  console.log(body);

  try {
    // Derive the absolute URL dynamically from the incoming request
    const host = req.headers.get("host");
    // Choose protocol based on environment
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const tokenExchangeUrl = `${baseUrl}/api/token`;

    const exchangeResponse = await fetch(tokenExchangeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: clerkToken }),
      credentials: "include"
    });

    if (!exchangeResponse.ok) {
      const err = await exchangeResponse.json();
      throw new Error(err.error || "Token exchange failed");
    }
    
    const { token: supabaseToken } = await exchangeResponse.json();
    
    const result = await createPatientWithToken(body, userId, supabaseToken)
    return NextResponse.json(result);

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  // Pass the cookie header so Clerk can properly extract the session
  const cookie = req.headers.get("cookie") || "";
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  
  const clerkToken = await getToken({ template: "supabase" });
  if (!clerkToken) {
    return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
  }
  
  try {
    // Derive the absolute URL dynamically from the incoming request
    const host = req.headers.get("host");
    // Choose protocol based on environment
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const tokenExchangeUrl = `${baseUrl}/api/token`;

    const exchangeResponse = await fetch(tokenExchangeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: clerkToken }),
      credentials: "include"
    });

    if (!exchangeResponse.ok) {
      const err = await exchangeResponse.json();
      throw new Error(err.error || "Token exchange failed");
    }
    
    const { token: supabaseToken } = await exchangeResponse.json();
    
    const data = await getPatientsByUserIdWithToken(userId, supabaseToken);
    return NextResponse.json(data);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
