"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Login() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") || "/tryout";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Gagal login");
      }
      router.replace(from);
    } catch (e: any) {
      setErr(e.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  {loading && <div className="spinner">Loading...</div>}

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Masuk ke Scholarify</h1>
          <p className="text-sm text-slate-500">Gunakan akun yang sudah didaftarkan.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full py-3 px-4 border rounded-lg border-slate-300 focus:border-blue-400 focus:ring-blue-200 bg-slate-50"
              placeholder="demo"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full py-3 px-4 border rounded-lg border-slate-300 focus:border-blue-400 focus:ring-blue-200 bg-slate-50"
              placeholder="demo123"
              required
            />
          </div>

          {/* Error Message */}
          {err && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {err}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 bg-[#143766] hover:bg-[#0f2a4f] text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        {/* Demo Account Information */}
        <div className="text-[12px] text-slate-500">
          Akun demo: <code>demo / demo123</code>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}