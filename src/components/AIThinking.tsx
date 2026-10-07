import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Target, CheckCircle2, Loader2 } from 'lucide-react';

const STAGES = [
  { icon: Search, label: 'Scraping live market data...', sub: 'Fetching listings from tech aggregators' },
  { icon: Brain, label: 'Evaluating hardware specs with Gemini...', sub: 'Parsing specifications & scoring devices' },
  { icon: Target, label: 'Matching preferences...', sub: 'Ranking top candidates for your needs' },
  { icon: CheckCircle2, label: 'Finalizing your top 3', sub: 'Building tailored rationale for each pick' },
];

interface AIThinkingProps {
  category: string;
  budget: number;
}

export default function AIThinking({ category, budget }: AIThinkingProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timers = STAGES.map((_, idx) =>
      setTimeout(() => setActive(idx), idx * 1100),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative mx-auto flex max-w-2xl flex-col items-center px-4 pt-20 text-center"
    >
      {/* Pulsing core */}
      <div className="relative mb-10 grid h-32 w-32 place-items-center">
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse-ring" />
        <span
          className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse-ring"
          style={{ animationDelay: '0.7s' }}
        />
        <span
          className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse-ring"
          style={{ animationDelay: '1.4s' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-cyan-400/20 to-sky-500/10 ring-1 ring-cyan-400/30 backdrop-blur-xl"
        >
          <Brain className="h-10 w-10 text-cyan-300" />
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-white sm:text-3xl"
      >
        Finding your perfect{' '}
        <span className="neon-text">{category.toLowerCase()}</span>
      </motion.h2>
      <p className="mt-2 text-sm text-slate-400">
        Analyzing devices under ₹{budget.toLocaleString('en-IN')} that match your preferences
      </p>

      {/* Stage list */}
      <div className="mt-10 w-full max-w-md space-y-2 text-left">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const state =
            idx < active ? 'done' : idx === active ? 'active' : 'pending';
          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${
                state === 'active'
                  ? 'border-cyan-400/40 bg-cyan-400/[0.06]'
                  : state === 'done'
                    ? 'border-white/10 bg-white/[0.02]'
                    : 'border-white/[0.04] bg-transparent opacity-40'
              }`}
            >
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  state === 'done'
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : state === 'active'
                      ? 'bg-cyan-400/15 text-cyan-300'
                      : 'bg-white/[0.04] text-slate-500'
                }`}
              >
                {state === 'active' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : state === 'done' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={`text-sm font-medium ${
                    state === 'pending' ? 'text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {stage.label}
                </div>
                <AnimatePresence>
                  {state === 'active' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-0.5 text-xs text-slate-400">{stage.sub}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
