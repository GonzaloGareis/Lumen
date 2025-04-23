import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// Before production, import Clerk's SDK for proper token verification
// import { verifyToken } from '@clerk/clerk-sdk-node';

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;
const SUPABASE_JWT_AUDIENCE = process.env.SUPABASE_JWT_AUDIENCE || 'authenticated';
const SUPABASE_JWT_EXPIRATION = process.env.SUPABASE_JWT_EXPIRATION || '3600'; // in seconds (or as a string accepted by jwt.sign)

export async function POST(request: Request): Promise<Response> {
  try {
    
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Clerk token is required.' }, { status: 400 });
    }

    //Recommended for production:
    // const verifiedToken = await verifyToken(token);
    // const clerkPayload = verifiedToken.payload;

    const clerkPayload = jwt.decode(token) as { sub?: string } | null;
    if (!clerkPayload || !clerkPayload.sub) {
      return NextResponse.json({ error: 'Invalid Clerk token.' }, { status: 400 });
    }

    // Prepare the payload for the Supabase-compatible token
    const supabasePayload = {
      app_metadata: {
        clerk_id: clerkPayload.sub   
        } , //The clerk ID is being passed in the app_metadata optional claim, because passing it inside the sub claim, supabase doesn't read it unless it's UUID format
      role: 'authenticated', // Role expected by your RLS policies
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    
    const supabaseToken = jwt.sign(supabasePayload, SUPABASE_JWT_SECRET, {
      audience: SUPABASE_JWT_AUDIENCE,
    });
    
    return NextResponse.json({ token: supabaseToken });
    
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error during token exchange.' },
      { status: 500 }
    );
  }
}