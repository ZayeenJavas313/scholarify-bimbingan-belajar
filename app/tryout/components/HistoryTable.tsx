"use client";
import { useEffect, useState } from "react";
import "../styles/HistoryTable.css";


type HistoryItem = {
  batch: string;
  date: string;
  subtests: string[];
  score: number;
  status: "Selesai" | "Belum";
};

export default function HistoryTable() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // ambil data dari localStorage (sementara sebelum koneksi ke Django)
    const stored = localStorage.getItem("tryout_history");
    const parsed: HistoryItem[] = stored ? JSON.parse(stored) : [];

    // urutkan dari terbaru ke lama
    parsed.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setHistory(parsed);
  }, []);

  if (history.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm mt-8">
        Belum ada riwayat pengerjaan tryout.
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Riwayat Pengerjaan & Nilai TryOut
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold">
              <th className="px-4 py-2 rounded-l-lg">Batch</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Subtest</th>
              <th className="px-4 py-2">Skor</th>
              <th className="px-4 py-2 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr
                key={idx}
                className={`border-b last:border-0 hover:bg-slate-50 transition`}
              >
                <td className="px-4 py-3 font-medium text-slate-700">
                  {item.batch}
                </td>
                <td className="px-4 py-3 text-slate-600">{item.date}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.subtests.join(", ")}
                </td>
                <td className="px-4 py-3 font-semibold text-[#143766]">
                  {item.score}
                </td>
                <td className="px-4 py-3">
                  {item.status === "Selesai" ? (
                    <span className="text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full text-xs">
                      {item.status}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-full text-xs">
                      {item.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Ringkasan Nilai */}
        <div className="flex justify-end items-center gap-6 text-sm text-slate-700 mb-3">
        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
            <strong>Total TryOut Selesai:</strong> 1 dari 3
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-100">
            Rata-rata Skor: 745
        </div>
        </div>
      </div>
    </div>
  );
}
