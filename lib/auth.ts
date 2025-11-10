import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();              // ← wajib await
  const raw = cookieStore.get("session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { username: string; name: string; role?: string };
  } catch {
    return null;
  }
}
