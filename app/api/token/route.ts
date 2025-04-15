import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// Optionally, import Clerk's SDK for proper token verification
// import { verifyToken } from '@clerk/clerk-sdk-node';

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;
const SUPABASE_JWT_AUDIENCE = process.env.SUPABASE_JWT_AUDIENCE || 'authenticated';
const SUPABASE_JWT_EXPIRATION = process.env.SUPABASE_JWT_EXPIRATION || '3600'; // in seconds (or as a string accepted by jwt.sign)

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the JSON body of the request
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Clerk token is required.' }, { status: 400 });
    }

    // Option A (Recommended for production):
    // const verifiedToken = await verifyToken(token);
    // const clerkPayload = verifiedToken.payload;

    // Option B (Simpler, for demonstration only):
    const clerkPayload = jwt.decode(token) as { sub?: string } | null;
    if (!clerkPayload || !clerkPayload.sub) {
      return NextResponse.json({ error: 'Invalid Clerk token.' }, { status: 400 });
    }

    // Prepare the payload for the Supabase-compatible token
    const supabasePayload = {
      app_metadata: {
        clerk_id: clerkPayload.sub   // your Clerk user id here
        } , // Use the Clerk user ID as the subject
      role: 'authenticated', // Role expected by your RLS policies
      exp: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
    };

    const supabaseToken = jwt.sign(supabasePayload, SUPABASE_JWT_SECRET, {
      audience: SUPABASE_JWT_AUDIENCE,
    });

    console.log(supabaseToken)
    
    return NextResponse.json({ token: supabaseToken });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error during token exchange.' },
      { status: 500 }
    );
  }
}
