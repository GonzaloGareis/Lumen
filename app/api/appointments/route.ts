import { NextResponse } from 'next/server';
import { createAppointment, getAppointmentsByUserIdWithToken } from '@/lib/appointmentService';
import { auth } from '@clerk/nextjs/server';
import { exchangeToken } from '@/lib/tokenService';


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
        if (!host) {
          throw new Error("Missing host header");
        }
    
    const { token: supabaseToken } = await exchangeToken(host, clerkToken);
    
    const data = await getAppointmentsByUserIdWithToken(userId, supabaseToken);
    return NextResponse.json(data);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
