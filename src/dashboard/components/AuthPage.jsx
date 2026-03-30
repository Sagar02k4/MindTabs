import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Chrome, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from '../../components/Button';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, error, clearError } = useAuthStore();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    clearError();
    setConfirmMessage('');

    if (mode === 'login') {
      await signInWithEmail(email, password);
    } else {
      const result = await signUpWithEmail(email, password);
      if (result?.confirmationRequired) {
        setConfirmMessage('Check your email for a confirmation link!');
      }
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan 
                        flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">MindTabs</h1>
          <p className="text-surface-400 text-sm">
            {mode === 'login' ? 'Welcome back! Sign in to sync your tabs.' : 'Create an account to sync across devices.'}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/20">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                      bg-white/5 border border-white/10 text-surface-200 font-medium text-sm
                      hover:bg-white/10 hover:border-white/20 transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Chrome size={18} />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-surface-700/50" />
            <span className="text-xs text-surface-500">or</span>
            <div className="flex-1 h-px bg-surface-700/50" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-field pl-10"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={loading || !email || !password}
              icon={loading ? Loader2 : (mode === 'login' ? LogIn : UserPlus)}
            >
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-slide-down">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Confirmation message */}
          {confirmMessage && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-slide-down">
              <Mail size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300">{confirmMessage}</p>
            </div>
          )}

          {/* Toggle */}
          <p className="mt-4 text-center text-xs text-surface-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); clearError(); setConfirmMessage(''); }}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Skip */}
        <p className="text-center text-xs text-surface-500 mt-4">
          You can also use MindTabs without an account (local-only mode).
        </p>
      </div>
    </div>
  );
}
