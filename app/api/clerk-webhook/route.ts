import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/lib/supabaseClient";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();

  const svix = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    const heads = {
      "svix-id": headerPayload.get("svix-id") ?? "",
      "svix-timestamp": headerPayload.get("svix-timestamp") ?? "",
      "svix-signature": headerPayload.get("svix-signature") ?? "",
    };

    evt = svix.verify(payload, heads);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { id, email_addresses, first_name, last_name } = evt.data;

  const { error } = await supabaseAdmin.from("users").insert([
    {
      id: id, // this is Clerk user id
      email: email_addresses?.[0]?.email_address ?? null,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || null,
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return new NextResponse("Database error", { status: 500 });
  }

  return new NextResponse("Success", { status: 200 });
}
