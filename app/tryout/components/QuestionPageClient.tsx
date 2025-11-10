// app/tryout/components/QuestionPageClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Subtest } from "@/data/subtests";
import { Question } from "@/data/questions";

type Props = {
  batchId: string;
  subtest: Subtest;
  questions: Question[];
};

export default function QuestionPageClient({
  batchId,
  subtest,
  questions,
}: Props) {
  const router = useRouter();

  // index soal berjalan
  const [currentIndex, setCurrentIndex] = useState(0);
  // jawaban user
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // timer dalam detik
  const [secondsLeft, setSecondsLeft] = useState(
    Math.round((subtest.duration ?? 30) * 60)
  );

  // format mm:ss
  const timeString = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secondsLeft % 60)
      .toString()
      .padStart(2, "0");
    return `${m} : ${s}`;
  }, [secondsLeft]);

  // tandai subtest selesai di localStorage
  const markSubtestDone = () => {
    if (typeof window === "undefined") return;
    const key = `tryout_progress_${batchId}`;
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[subtest.id] = "done";
    localStorage.setItem(key, JSON.stringify(parsed));
  };

  // selesai → balik
  const finishAndBack = (reason: "submit" | "time") => {
    markSubtestDone();
    router.replace(`/tryout/${batchId}/do?done=${subtest.id}&r=${reason}`);
  };

  // timer jalan
  useEffect(() => {
    if (secondsLeft <= 0) {
      finishAndBack("time");
      return;
    }
    const t = setInterval(() => {
      setSecondsLeft((sec) => sec - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // kalau user maksa balik ke subtest yang sudah dikerjakan, kunci
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `tryout_progress_${batchId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[subtest.id] === "done") {
        router.replace(`/tryout/${batchId}/do`);
      }
    }
  }, [batchId, subtest.id, router]);

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const handleSubmit = () => {
    finishAndBack("submit");
  };

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
  };

  return (
    <div className="flex gap-6">
      {/* KIRI */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm p-8">
        {/* header soal */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              {subtest.title}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {currentQuestion?.question ??
                (currentQuestion as any)?.text ??
                "Soal"}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Nomor soal : {currentIndex + 1} / {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Sisa waktu</p>
            <p className="text-2xl font-bold text-slate-900 tracking-wide">
              {timeString}
            </p>
          </div>
        </div>

        {/* opsi jawaban */}
        <div className="space-y-3">
          {(currentQuestion?.options ?? (currentQuestion as any)?.choices ?? [])
            .map((opt: any, i: number) => {
              // support option bentuk string atau objek {label, value}
              const label =
                typeof opt === "string"
                  ? opt
                  : opt?.label ?? opt?.text ?? `Pilihan ${i + 1}`;
              const value =
                typeof opt === "string" ? opt : opt?.value ?? label;

              const selected = answers[currentIndex] === value;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition
                    ${
                      selected
                        ? "border-[#143766] bg-[#143766]/5 text-slate-900"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
        </div>

        {/* footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="px-5 py-2 rounded-xl border text-slate-700 disabled:opacity-40"
          >
            Soal Sebelumnya
          </button>

          <p className="text-sm text-slate-500">
            Nomor Soal : {currentIndex + 1} / {questions.length}
          </p>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#1C63F2] text-white text-sm font-medium"
          >
            Kirim Jawaban
          </button>
        </div>
      </div>

      {/* KANAN */}
      <div className="w-[260px]">
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Navigasi Soal
            </h2>
            <p className="text-xs text-slate-400">Pilih nomor soal</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => {
              const answered = answers[idx];
              const active = idx === currentIndex;

              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium
                    ${
                      active
                        ? "bg-[#143766] text-white"
                        : answered
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
            <span className="inline-flex w-3 h-3 rounded bg-[#143766]" />{" "}
            Sedang dikerjakan
            <span className="inline-flex w-3 h-3 rounded bg-emerald-400" />{" "}
            Sudah dijawab
            <span className="inline-flex w-3 h-3 rounded bg-slate-200" /> Belum
            dijawab
          </div>
        </div>
      </div>
    </div>
  );
}
