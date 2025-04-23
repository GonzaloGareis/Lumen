import { NextResponse } from 'next/server';
import { createAppointment, getAppointmentsByUserIdWithToken } from '@/lib/appointmentService';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  
  const cookie = req.headers.get("cookie") || "";
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const result = await createAppointment({ ...body, user_id: userId });
  return NextResponse.json(result);
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
  
  try {
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const tokenExchangeUrl = `${protocol}://${host}/api/token`;

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
    
    const data = await getAppointmentsByUserIdWithToken(userId, supabaseToken);
    return NextResponse.json(data);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
