import React, { useState, useEffect, useRef } from 'react';
import { triggerConfetti } from '../utils/confetti';
import { useEscapeClose } from '../utils/useEscapeClose';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (amount: number) => void;
  lang?: 'id' | 'en';
}

const DEFAULT_TIME = 25 * 60; // 25 mins

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  lang = 'id',
}) => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  useEscapeClose(isOpen, onClose);

  // Timer Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      stopAmbientSound();
      setSessionCompleted(true);
      onRewardXP(25);
      triggerConfetti();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, onRewardXP]);

  // Ambient Sound Engine (Web Audio API - Zero External Files)
  const startAmbientSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Create pink/brown noise for relaxing focus background
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.11; // comfortable volume
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noiseNodeRef.current = noise;
    } catch (e) {
      console.warn('Web Audio Ambient failed:', e);
    }
  };

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as AudioBufferSourceNode).stop();
      } catch {}
      noiseNodeRef.current = null;
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      startAmbientSound();
      setSoundEnabled(true);
    } else {
      stopAmbientSound();
      setSoundEnabled(false);
    }
  };

  const handleToggleTimer = () => {
    if (!isRunning && soundEnabled) {
      startAmbientSound();
    } else if (isRunning) {
      stopAmbientSound();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    stopAmbientSound();
    setTimeLeft(DEFAULT_TIME);
    setSessionCompleted(false);
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((DEFAULT_TIME - timeLeft) / DEFAULT_TIME) * 100;

  const L = {
    title: lang === 'id' ? 'Focus Study Timer ⏱️' : 'Focus Study Timer ⏱️',
    subtitle: lang === 'id' ? '25-menit sesi belajar tanpa gangguan' : '25-min distraction-free focus session',
    completed: lang === 'id' ? '🎉 Selesai! +25 XP Didapatkan!' : '🎉 Session Complete! +25 XP Earned!',
    ambientSound: lang === 'id' ? 'Suara Ambient (White Noise)' : 'Ambient Sound (White Noise)',
    start: lang === 'id' ? 'Mulai Fokus' : 'Start Focus',
    pause: lang === 'id' ? 'Jeda' : 'Pause',
    reset: lang === 'id' ? 'Reset' : 'Reset',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-sm p-6 shadow-2xl relative text-white border border-white/10 flex flex-col items-center text-center gap-5">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d1c4e9] text-2xl">timer</span>
            <h3 className="font-jakarta font-black text-lg text-white">{L.title}</h3>
          </div>
          <button
            onClick={() => {
              stopAmbientSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 font-jakarta">{L.subtitle}</p>

        {/* Circular Progress Display */}
        <div className="relative w-48 h-48 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" className="text-white/10" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#d1c4e9"
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono-code font-black text-4xl text-white tracking-wider">{timeFormatted}</span>
            <span className="text-[10px] font-jakarta text-[#d1c4e9] font-bold mt-1 uppercase tracking-widest">
              {isRunning ? 'Focusing...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Completion Banner */}
        {sessionCompleted && (
          <div className="w-full p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black animate-bounce">
            {L.completed}
          </div>
        )}

        {/* Ambient Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-[#d1c4e9]/20 border-[#d1c4e9] text-[#d1c4e9]'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {soundEnabled ? 'volume_up' : 'volume_off'}
          </span>
          <span>{L.ambientSound}</span>
        </button>

        {/* Actions */}
        <div className="w-full flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3 font-bold font-jakarta transition-colors cursor-pointer text-sm"
          >
            {L.reset}
          </button>
          <button
            onClick={handleToggleTimer}
            className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3 font-jakarta hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-sm"
          >
            {isRunning ? L.pause : L.start}
          </button>
        </div>
      </div>
    </div>
  );
};
