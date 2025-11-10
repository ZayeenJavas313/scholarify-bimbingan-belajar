import { NextResponse } from "next/server";
import { users } from "@/data/users";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username & password wajib" }, { status: 400 });
    }

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    // simpan info minimal di cookie (HttpOnly)
    const payload = { username: user.username, name: user.name, role: user.role ?? "student" };

    const res = NextResponse.json({ ok: true, user: payload });
    res.cookies.set("session", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "lax",
      secure: false,           // set true di production (https)
      path: "/",
      maxAge: 60 * 60 * 8,     // 8 jam
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
