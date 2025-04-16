import { NextResponse } from 'next/server';
import { updatePatient, deletePatient } from '@/lib/patientService';
import { auth } from '@clerk/nextjs/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
 
  const { userId, getToken } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  
  const clerkToken = await getToken({ template: "supabase" });
  if (!clerkToken) {
    return new Response(JSON.stringify({ error: "No clerk token found" }), { status: 401 });
  }
  
  
  let updateData;
  try {
    updateData = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
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
    
    const data = await updatePatient(params.id, userId, updateData, supabaseToken);
    return NextResponse.json(data);
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {

  const { userId, getToken } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  
  const clerkToken = await getToken({ template: "supabase" });

  if (!clerkToken) {
    return new Response(JSON.stringify({ error: "No clerk token found" }), { status: 401 });
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
    
    
    const data = await deletePatient(params.id, userId, supabaseToken);
    return NextResponse.json(data);
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
