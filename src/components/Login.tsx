import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { friendlyAuthError } from '@/lib/authErrors';
import { Mail, Lock, ArrowRight, Loader2, Cpu, Sparkles } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onForgotPassword: () => void;
}

export default function Login({ onBack, onForgotPassword }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile document in Firestore
        try {
          await setDoc(doc(db, 'users', userCred.user.uid), {
            email: userCred.user.email,
            createdAt: new Date().toISOString(),
          });
        } catch (firestoreError) {
          console.error("Firestore Error:", firestoreError);
          throw firestoreError;
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onBack(); // Go back home on success
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: 'url(/loginbg.jpg)' }}
    >
      <div className="absolute inset-0 bg-[#090d16]/60" />

      <div className="relative w-full max-w-md">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-cyan-900/20 border border-white/10"
        >
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 relative items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/10 to-sky-500/5 ring-1 ring-white/10 shadow-inner">
              <Cpu className="h-8 w-8 text-cyan-400" />
              <Sparkles className="absolute right-3 top-3 h-3 w-3 text-cyan-300 animate-pulse" />
            </div>
            <h1 className="font-display text-4xl font-extrabold text-white mb-2">PickMyTech</h1>
            <p className="text-sm text-cyan-300 mb-8 font-medium">AI-powered tech hardware recommendations.</p>

            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isSignUp ? 'Join PickMyTech to save your picks.' : 'Log in to get your best picks.'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 transition-all hover:bg-white/[0.04] focus:border-cyan-400/60 focus:bg-white/[0.02] focus:outline-none focus:ring-1 focus:ring-cyan-400/60"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 transition-all hover:bg-white/[0.04] focus:border-cyan-400/60 focus:bg-white/[0.02] focus:outline-none focus:ring-1 focus:ring-cyan-400/60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 w-full justify-center group relative overflow-hidden"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Log In'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
