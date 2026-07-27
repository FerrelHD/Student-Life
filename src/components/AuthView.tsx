import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LanguageType, UserProfile } from '../types';
import { supabase } from '../lib/supabaseClient';
import { getTranslation } from '../utils/i18n';

// On native mobile, the emailed reset link must reopen the app via a custom
// URL scheme (see App.tsx's appUrlOpen listener) instead of a web redirect —
// scheme must also be registered as an allowed redirect URL in the Supabase
// dashboard (Authentication -> URL Configuration).
const NATIVE_RESET_REDIRECT_URL = 'studentlife://reset-callback';

// ─── Types ────────────────────────────────────────────────────
type AuthMode = 'login' | 'register' | 'forgot';
type ForgotStep = 'request' | 'sent';
type SendState = 'idle' | 'sending' | 'success' | 'error';

interface AuthViewProps {
  language: LanguageType;
  onLoginSuccess: (user?: Partial<UserProfile>) => void;
  onToggleLanguage: () => void;
  // True when the user arrived via the emailed reset link — Supabase already
  // verified them, so skip straight to setting a new password (no OTP needed).
  recoverySession?: boolean;
  onRecoveryDone?: () => void;
}

// ─── Component ────────────────────────────────────────────────
export const AuthView: React.FC<AuthViewProps> = ({
  language,
  onLoginSuccess,
  onToggleLanguage,
  recoverySession,
  onRecoveryDone,
}) => {
  const isIndonesian = language === 'id';
  const t = getTranslation(language);

  // ── Form state ──
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [registerNotice, setRegisterNotice] = useState('');

  // ── Forgot password state ──
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendState, setSendState] = useState<SendState>('idle');
  const [sendError, setSendError] = useState('');

  // ── Recovery-link state (arrived via emailed link, no OTP needed) ──
  const [recoveryPassword, setRecoveryPassword] = useState('');
  const [recoveryPasswordConfirm, setRecoveryPasswordConfirm] = useState('');
  const [recoverySaving, setRecoverySaving] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');

  // ── Handlers ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading || !email.trim() || !password.trim()) return;
    if (mode === 'register' && password !== passwordConfirm) {
      setAuthError(t.authPasswordMismatch);
      return;
    }
    setAuthError('');
    setRegisterNotice('');
    setAuthLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: fullName.trim(),
              university: isIndonesian ? 'Universitas Indonesia' : 'Stanford University',
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          // Email confirmation disabled on this project -> session is live immediately.
          onLoginSuccess();
        } else {
          // Email confirmation required before a session is issued.
          setRegisterNotice(t.authAccountCreated);
          setMode('login');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        onLoginSuccess();
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : String(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (authLoading || !import.meta.env.DEV) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      // Seeded once via Supabase (see supabase/schema.sql setup notes) so the
      // one-click demo button signs in with a real account, not a fake bypass.
      const { error } = await supabase.auth.signInWithPassword({
        email: 'jacob.miller@ui.ac.id',
        password: 'password123',
      });
      if (error) throw error;
      onLoginSuccess();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : String(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendState === 'sending' || !forgotEmail.trim()) return;

    setSendState('sending');
    setSendError('');

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: Capacitor.isNativePlatform() ? NATIVE_RESET_REDIRECT_URL : undefined,
    });
    if (error) {
      setSendError(error.message);
      setSendState('error');
      return;
    }
    setSendState('idle');
    setForgotStep('sent');
  };

  const handleSetRecoveryPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recoverySaving || !recoveryPassword.trim()) return;
    if (recoveryPassword !== recoveryPasswordConfirm) {
      setRecoveryError(t.authPasswordMismatch);
      return;
    }

    setRecoverySaving(true);
    setRecoveryError('');

    const { error } = await supabase.auth.updateUser({ password: recoveryPassword });
    setRecoverySaving(false);
    if (error) {
      setRecoveryError(error.message);
      return;
    }
    onRecoveryDone?.();
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setAuthError('');
    setPasswordConfirm('');
    setSendState('idle');
    setSendError('');
    setForgotStep('request');
    setForgotEmail('');
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f3f9] dark:bg-[#0f0e13] text-[#1b1b1d] dark:text-[#f3f0f2] flex items-center justify-center p-5 relative overflow-hidden font-jakarta">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 dark:opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#d1c4e9] dark:bg-[#6b5096] blur-3xl animate-orb-1 opacity-90" />
        <div className="absolute bottom-10 -right-24 w-96 h-96 rounded-full bg-[#ece28c] dark:bg-[#7a7434] blur-3xl animate-orb-2 opacity-70" />
      </div>

      {/* ── Main Card ── */}
      <div className="w-full max-w-md expressive-card expressive-card-onyx p-8 shadow-2xl relative z-10 text-white border border-white/10 expressive-shimmer">

        {/* ── Brand + Language ── */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div>
              <h2 className="font-jakarta font-black text-lg text-white leading-tight">Student Life</h2>
              <p className="font-jakarta text-[10px] font-bold text-[#d1c4e9] uppercase tracking-wider">Academic Companion</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#ece28c] px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            <span>{isIndonesian ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
            <span className="material-symbols-outlined text-xs">sync_alt</span>
          </button>
        </div>

        {/* ─────────────────────────────── RECOVERY LINK MODE ─────────────────────────────── */}
        {recoverySession && (
          <>
            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#d1c4e9] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-[#1f1732]">lock_reset</span>
              </div>
              <h1 className="font-jakarta font-black text-2xl text-white tracking-tight mb-1">
                {t.authSetNewPassword}
              </h1>
              <p className="font-jakarta text-xs text-gray-300 font-bold">
                {t.authRecoveryVerified}
              </p>
            </div>

            <form onSubmit={handleSetRecoveryPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-300 mb-1">
                  {t.authNewPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={recoveryPassword}
                  onChange={(e) => setRecoveryPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-300 mb-1">
                  {t.authConfirmPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={recoveryPasswordConfirm}
                  onChange={(e) => setRecoveryPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                />
              </div>

              {recoveryError && (
                <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/30 rounded-2xl px-4 py-3">
                  <span className="material-symbols-outlined text-red-400 text-base flex-shrink-0 mt-0.5">error</span>
                  <p className="text-xs text-red-300 font-bold">{recoveryError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={recoverySaving}
                className="w-full bg-[#d1c4e9] text-[#1f1732] font-black py-3.5 rounded-full text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {recoverySaving ? t.authSaving : t.authSetNewPasswordBtn}
              </button>
            </form>
          </>
        )}

        {/* ─────────────────────────────── FORGOT MODE ─────────────────────────────── */}
        {!recoverySession && mode === 'forgot' && (
          <>
            {/* Back button */}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-bold mb-5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              {t.authBackToLogin}
            </button>

            {forgotStep === 'request' && (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#d1c4e9] flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-[#1f1732]">lock_reset</span>
                  </div>
                  <h1 className="font-jakarta font-black text-2xl text-white tracking-tight mb-1">
                    Reset Password 🔐
                  </h1>
                  <p className="font-jakarta text-xs text-gray-300 font-bold">
                    {t.authResetPasswordDesc}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-300 mb-1">
                      {t.authStudentEmailLabel}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">mail</span>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. jacob.miller@ui.ac.id"
                        className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {sendState === 'error' && (
                    <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/30 rounded-2xl px-4 py-3">
                      <span className="material-symbols-outlined text-red-400 text-base flex-shrink-0 mt-0.5">error</span>
                      <p className="text-xs text-red-300 font-bold">{sendError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sendState === 'sending'}
                    className="w-full bg-[#d1c4e9] text-[#1f1732] font-black py-3.5 rounded-full text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendState === 'sending' ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-[#1f1732]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {t.authSending}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">send</span>
                        {t.authSendResetLink}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {forgotStep === 'sent' && (
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 rounded-full bg-green-900/30 border-2 border-green-400/40 flex items-center justify-center mx-auto animate-bounce-once">
                  <span className="material-symbols-outlined text-4xl text-green-400">mark_email_read</span>
                </div>
                <div>
                  <h2 className="font-jakarta font-black text-xl text-white mb-2">
                    {t.authCheckEmailTitle}
                  </h2>
                  <p className="font-jakarta text-xs text-gray-300 font-bold leading-relaxed">
                    {t.authResetLinkSent.replace('{email}', forgotEmail)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full bg-[#d1c4e9] text-[#1f1732] font-black py-3 rounded-full text-sm hover:scale-[1.02] transition-all cursor-pointer"
                >
                  {t.authBackToLogin}
                </button>
              </div>
            )}
          </>
        )}

        {/* ─────────────────────────────── LOGIN / REGISTER MODE ─────────────────────────────── */}
        {!recoverySession && mode !== 'forgot' && (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-jakarta font-black text-2xl text-white tracking-tight mb-1">
                {mode === 'login' ? t.authWelcomeBack : t.authCreateAccountTitle}
              </h1>
              <p className="font-jakarta text-xs text-gray-300 font-bold">
                {mode === 'login' ? t.authSignInDesc : t.authRegisterDesc}
              </p>
            </div>

            {/* Registration notice (e.g. "check your email") */}
            {registerNotice && (
              <div className="mb-4 flex items-start gap-2 bg-green-900/20 border border-green-500/20 rounded-2xl px-4 py-3">
                <span className="material-symbols-outlined text-green-400 text-base flex-shrink-0 mt-0.5">mark_email_read</span>
                <p className="text-xs text-green-300 font-bold">{registerNotice}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex bg-white/10 p-1.5 rounded-full border border-white/10 mb-6">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-full font-jakarta text-xs font-black transition-all cursor-pointer ${
                    mode === m ? 'bg-[#d1c4e9] text-[#1f1732] shadow-md' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {m === 'login' ? t.authSignInTab : t.authRegisterTab}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-gray-300 mb-1">
                    {t.authFullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jacob Miller"
                    className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 mb-1">
                  {t.authStudentEmailIdLabel}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">mail</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jacob.miller@ui.ac.id"
                    className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-extrabold text-gray-300 mb-1">
                  {t.authPasswordLabel}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm password (register only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-gray-300 mb-1">
                    {t.authConfirmPasswordLabel}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
                  />
                </div>
              )}

              {/* Forgot */}
              {mode === 'login' && (
                <div className="flex items-center justify-end text-xs font-bold text-gray-300 pt-1">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[#d1c4e9] hover:underline cursor-pointer"
                  >
                    {t.authForgotPassword}
                  </button>
                </div>
              )}

              {/* Auth error */}
              {authError && (
                <div className="flex items-start gap-2 bg-red-900/30 border border-red-500/30 rounded-2xl px-4 py-3">
                  <span className="material-symbols-outlined text-red-400 text-base flex-shrink-0 mt-0.5">error</span>
                  <p className="text-xs text-red-300 font-bold">{authError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#d1c4e9] text-[#1f1732] font-black py-3.5 rounded-full text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {authLoading
                  ? t.authProcessing
                  : mode === 'login'
                  ? t.authSignInNow
                  : t.authCreateStudentAccount}
              </button>
            </form>

            {/* Demo login (dev builds only) */}
            {import.meta.env.DEV && (
              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <p className="text-xs text-gray-400 font-bold mb-3">
                  {t.authDemoLoginPrompt}
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={authLoading}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base text-[#ece28c]">key</span>
                  <span>
                    {t.authDemoLoginBtn}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
