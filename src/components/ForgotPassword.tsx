import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md px-4 pt-12 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong overflow-hidden rounded-3xl p-8"
      >
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we'll send you a link to reset your password.
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

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mt-8 flex flex-col items-center text-center"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan-400/20 text-cyan-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-white">Check your email</p>
            <p className="mt-2 text-sm text-slate-400">
              We've sent a password reset link to <br/>
              <span className="text-white">{email}</span>
            </p>
            <button
              onClick={onBackToLogin}
              className="btn-primary mt-8 w-full justify-center"
            >
              Back to Login
            </button>
          </motion.div>
        ) : (
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
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 w-full justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}
      </motion.div>

      <div className="mt-6 text-center">
        <button onClick={onBackToLogin} className="flex items-center mx-auto text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
        </button>
      </div>
    </div>
  );
}
