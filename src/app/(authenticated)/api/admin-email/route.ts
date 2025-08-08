import { NextResponse } from "next/server";

export async function GET() {
  const adminEmail = process.env.ADMIN_EMAIL_FEEDBACK;

  if (!adminEmail) {
    return NextResponse.json({ error: "Admin email not set." }, { status: 500 });
  }

  return NextResponse.json({ adminEmail });
}