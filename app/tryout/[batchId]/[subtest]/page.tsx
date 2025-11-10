// app/tryout/[batchId]/[subtest]/page.tsx
import { subtests } from "@/data/subtests";
import { questions } from "@/data/questions";
import QuestionPageClient from "../../components/QuestionPageClient"; // ⬅️ RELATIF, bukan "@/app/..."

export default async function SubtestPage({
  params,
}: {
  params: Promise<{ batchId: string; subtest: string }>;
}) {
  const { batchId, subtest } = await params;

  // cari subtest-nya
  const currentSubtest = subtests.find(
    (s) =>
      s.batchId.toLowerCase() === batchId.toLowerCase() &&
      s.id.toLowerCase() === subtest.toLowerCase()
  );

  if (!currentSubtest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">
            Subtest tidak ditemukan
          </h1>
          <p className="text-slate-500">
            Pastikan URL benar atau pilih subtest dari halaman sebelumnya.
          </p>
          <a
            href={`/tryout/${batchId}/do`}
            className="inline-flex mt-2 px-4 py-2 rounded-xl bg-[#143766] text-white text-sm"
          >
            ← Kembali
          </a>
        </div>
      </div>
    );
  }

  // ambil soal sesuai subtest
  const subtestQuestions = questions.filter(
    (q) => q.subtestId?.toLowerCase() === currentSubtest.id.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <QuestionPageClient
          batchId={batchId}
          subtest={currentSubtest}
          questions={subtestQuestions}
        />
      </div>
    </div>
  );
}
