import { NextResponse } from 'next/server';
import { createAppointment } from '@/lib/appointmentService';
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
