import { motion } from 'framer-motion';
import { Cpu, LogOut, User, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onHome: () => void;
  onLogin: () => void;
  onOpenHistory?: () => void;
}

export default function Header({ onHome, onLogin, onOpenHistory }: HeaderProps) {
  const { user, logout } = useAuth();
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-3 flex items-center justify-between rounded-2xl glass px-4 py-3 sm:px-6">
          <button
            onClick={onHome}
            className="group flex items-center gap-2.5"
            aria-label="PickMyTech home"
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/30">
              <Cpu className="h-5 w-5 text-[#090d16]" strokeWidth={2.5} />
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
            </div>
            <div className="text-left leading-tight">
              <span className="block font-display text-base font-bold tracking-tight text-white">
                PickMyTech
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                AI Hardware Advisor
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-1 sm:flex">
            {[
              { name: 'How it works', href: '#how-it-works' },
              { name: 'Categories', href: '#categories' },
              { name: 'About', href: '#about' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                title="View Firestore History"
              >
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">History</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <User className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
