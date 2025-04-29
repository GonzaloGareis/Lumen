import { NextResponse } from 'next/server';
import { updatePatient, deletePatient } from '@/lib/patientService';
import { auth } from '@clerk/nextjs/server';
import { exchangeToken } from '@/lib/tokenService';

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
  
  
  const host = req.headers.get("host");
  if (!host) {
    throw new Error("Missing host header");
  }

  try {
    const supabaseToken = await exchangeToken(host, clerkToken);
    const data = await updatePatient(params.id, userId, updateData, supabaseToken);
    return NextResponse.json(data);

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
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
  
  const host = req.headers.get("host");
  if (!host) {
    throw new Error("Missing host header");
  }

  try {
    const supabaseToken = await exchangeToken(host, clerkToken);
    const data = await deletePatient(params.id, userId, supabaseToken);
    return NextResponse.json(data);

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}
