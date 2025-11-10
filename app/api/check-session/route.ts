import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("session")?.value;
  return NextResponse.json({ ok: hasSession });
}
