import React, { useEffect, useState } from 'react';
import { LanguageType } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { useEscapeClose } from '../utils/useEscapeClose';
import { supabase } from '../lib/supabaseClient';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface DailyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
  onQuizCompleted: () => void;
  language?: LanguageType;
  university?: string;
  lastQuizDate?: string | null;
}

// ─── Offline/error fallback questions (used if the AI edge function fails) ──
const QUESTIONS_ID: QuizQuestion[] = [
  {
    question: 'Apa kompleksitas waktu rata-rata pencarian pada Binary Search Tree (BST)?',
    options: ['O(N)', 'O(log N)', 'O(N²)', 'O(1)'],
    correctIndex: 1,
    explanation: 'BST membagi ruang pencarian menjadi setengah di setiap langkah, menghasilkan kompleksitas rata-rata O(log N)!',
  },
  {
    question: 'Prinsip Ketidakpastian Heisenberg menyatakan bahwa…',
    options: [
      'Energi selalu kekal',
      'Cahaya lebih cepat dari suara',
      'Posisi dan momentum tidak bisa diukur secara bersamaan dengan tepat',
      'Elektron mengorbit dalam lapisan lingkaran',
    ],
    correctIndex: 2,
    explanation: 'Presisi posisi dan momentum terhubung secara terbalik melalui konstanta Planck!',
  },
  {
    question: 'Kode status HTTP mana yang berarti permintaan berhasil?',
    options: ['404', '500', '200', '301'],
    correctIndex: 2,
    explanation: '200 OK menandakan respons permintaan HTTP berhasil!',
  },
  {
    question: 'Jenis data manakah yang menggunakan struktur Last In First Out (LIFO)?',
    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
    correctIndex: 2,
    explanation: 'Stack menggunakan prinsip LIFO — elemen terakhir masuk adalah yang pertama keluar!',
  },
  {
    question: 'Hukum Newton ke-2 menyatakan bahwa Gaya (F) sama dengan…',
    options: ['m + a', 'm × a', 'm ÷ a', 'm − a'],
    correctIndex: 1,
    explanation: 'F = ma. Gaya sama dengan massa dikalikan percepatan — dasar dari mekanika klasik!',
  },
];

const QUESTIONS_EN: QuizQuestion[] = [
  {
    question: 'What is the average time complexity of searching in a Binary Search Tree (BST)?',
    options: ['O(N)', 'O(log N)', 'O(N²)', 'O(1)'],
    correctIndex: 1,
    explanation: 'BST halves the search space at each step, yielding O(log N) average time complexity!',
  },
  {
    question: "Heisenberg's Uncertainty Principle states that…",
    options: [
      'Energy is always conserved',
      'Light travels faster than sound',
      'Position and momentum cannot be simultaneously measured with exact precision',
      'Electrons orbit in circular shells',
    ],
    correctIndex: 2,
    explanation: "The precision of position and momentum are inversely linked by Planck's constant!",
  },
  {
    question: 'Which HTTP status code means the request was successful?',
    options: ['404', '500', '200', '301'],
    correctIndex: 2,
    explanation: '200 OK indicates a successful HTTP request response!',
  },
  {
    question: 'Which data structure uses Last In First Out (LIFO) order?',
    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
    correctIndex: 2,
    explanation: 'Stack uses LIFO — the last element inserted is the first to be removed!',
  },
  {
    question: "Newton's 2nd Law states that Force (F) equals…",
    options: ['m + a', 'm × a', 'm ÷ a', 'm − a'],
    correctIndex: 1,
    explanation: 'F = ma. Force equals mass times acceleration — the foundation of classical mechanics!',
  },
];

function randomFallback(isID: boolean): QuizQuestion {
  const pool = isID ? QUESTIONS_ID : QUESTIONS_EN;
  return pool[Math.floor(Math.random() * pool.length)];
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Component ───────────────────────────────────────────────
export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  onQuizCompleted,
  language = 'id',
  university = '',
  lastQuizDate,
}) => {
  const isID = language === 'id';
  const alreadyDoneToday = lastQuizDate === todayStr();

  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (!isOpen || alreadyDoneToday) return;

    let cancelled = false;
    setSelectedOption(null);
    setSubmitted(false);
    setClaimed(false);
    setUsedFallback(false);
    setLoading(true);

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-quiz', {
          body: { language, university },
        });
        if (error || !data || !Array.isArray(data.options)) throw error ?? new Error('bad response');
        if (!cancelled) setQuiz(data as QuizQuestion);
      } catch (err) {
        console.error('[quiz] AI generation failed, using offline fallback:', err);
        if (!cancelled) {
          setQuiz(randomFallback(isID));
          setUsedFallback(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  // ─── Labels ───────────────────────────────────────────────
  const labels = {
    title: isID ? 'Tantangan Kuis Harian' : 'Daily Quiz Challenge',
    xpReward: '+50 XP',
    submitBtn: isID ? 'Kirim Jawaban' : 'Submit Answer',
    correctMsg: isID ? '🎉 Benar! +50 XP Berhasil Didapat!' : '🎉 Correct! +50 XP Earned!',
    wrongMsg: isID ? '❌ Kurang tepat!' : '❌ Not quite right!',
    claimBtn: isID ? 'Klaim +50 XP & Tutup' : 'Claim +50 XP & Close',
    closeBtn: isID ? 'Tutup' : 'Close',
    doneToday: isID
      ? 'Kamu sudah menyelesaikan kuis hari ini. Balik lagi besok ya!'
      : "You've already completed today's quiz. Come back tomorrow!",
    fallbackNote: isID
      ? 'Mode offline — soal dari bank soal lokal (AI tidak tersedia).'
      : 'Offline mode — question from the local bank (AI unavailable).',
  };

  const handleClaim = () => {
    if (quiz && selectedOption === quiz.correctIndex && !claimed) {
      onRewardXP(50);
      onQuizCompleted();
      setClaimed(true);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10">

        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#ece28c] text-[#1f1c00] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h3 className="font-jakarta font-black text-base text-white">{labels.title}</h3>
              <p className="font-jakarta text-xs text-[#ece28c] font-bold">{labels.xpReward} {isID ? 'Hadiah' : 'Reward'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={labels.closeBtn}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {alreadyDoneToday ? (
          <div className="py-8 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#ece28c]">check_circle</span>
            <p className="font-jakarta text-sm font-bold text-gray-200">{labels.doneToday}</p>
          </div>
        ) : loading || !quiz ? (
          <div className="py-14 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#ece28c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 font-jakarta">
            {usedFallback && (
              <p className="text-[10px] font-bold text-gray-400 -mt-1">{labels.fallbackNote}</p>
            )}
            <p className="font-black text-sm leading-snug text-white">{quiz.question}</p>

            {/* Options */}
            <div className="space-y-2.5">
              {quiz.options.map((option, idx) => {
                let style = 'bg-white/10 hover:bg-white/20 text-white border-white/10';
                if (submitted) {
                  if (idx === quiz.correctIndex) {
                    style = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                  } else if (idx === selectedOption) {
                    style = 'bg-rose-500/20 border-rose-400 text-rose-300';
                  } else {
                    style = 'bg-white/5 opacity-50 border-transparent';
                  }
                } else if (selectedOption === idx) {
                  style = 'bg-[#d1c4e9]/20 border-[#d1c4e9] text-white font-bold';
                }
                return (
                  <button
                    key={idx}
                    disabled={submitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${style}`}
                  >
                    <span>{option}</span>
                    {submitted && idx === quiz.correctIndex && (
                      <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                    )}
                    {submitted && idx === selectedOption && idx !== quiz.correctIndex && (
                      <span className="material-symbols-outlined text-rose-400 text-lg">cancel</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div className={`p-4 rounded-2xl text-xs font-bold ${selectedOption === quiz.correctIndex ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
                <p className="mb-1">{selectedOption === quiz.correctIndex ? labels.correctMsg : labels.wrongMsg}</p>
                <p className="font-semibold opacity-90">{quiz.explanation}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              {!submitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={() => {
                    setSubmitted(true);
                    if (selectedOption === quiz.correctIndex) triggerConfetti();
                  }}
                  className="w-full bg-[#ece28c] text-[#1f1c00] font-black py-3.5 rounded-full text-sm clay-raised hover:scale-[1.02] active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
                >
                  {labels.submitBtn}
                </button>
              ) : (
                <button
                  onClick={handleClaim}
                  className="w-full bg-[#d1c4e9] text-[#1f1732] font-black py-3.5 rounded-full text-sm clay-raised hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  {selectedOption === quiz.correctIndex ? labels.claimBtn : labels.closeBtn}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
