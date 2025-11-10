import Link from "next/link";
import { subtests } from "@/data/subtests";
import { batches } from "@/data/batches";
import SubtestListClient from "@/app/components/SubtestListClient";

export default async function DoPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;

  const batch = batches.find(
    (b) =>
      `batch-${String(b.id)}`.toLowerCase() === batchId.toLowerCase() ||
      String(b.id) === batchId
  );

  const title = batch?.title ?? "TryOut";
  const list = subtests.filter(
    (s) => s.batchId.toLowerCase() === batchId.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <main className="mx-auto max-w-6xl px-4 pt-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Pilih subtest untuk dikerjakan</p>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <Link
            href={`/tryout/${batchId}`}
            className="text-xs px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
          >
            ← Kembali ke instruksi
          </Link>
        </div>

        {/* GRID SUBTEST + STATUS SELESAI */}
        <SubtestListClient batchId={batchId} subtests={list} />
      </main>
    </div>
  );
}
