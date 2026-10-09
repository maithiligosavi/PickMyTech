import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Tag, ArrowRight, RotateCcw, Trophy, AlertCircle, SlidersHorizontal, History, HelpCircle, ArrowUpRight } from 'lucide-react';
import type { Device, Category, UseCase, BudgetValidationResult } from '@/lib/catalog';
import { validateBudget } from '@/lib/catalog';

interface ResultsProps {
  devices: Device[];
  category?: Category | string;
  budget?: number;
  useCase?: UseCase | string;
  fallbackInfo?: BudgetValidationResult;
  notice?: string;
  onRestart: () => void;
  onRefine: () => void;
  onExploreFloor?: (price: number) => void;
  onOpenHistory?: () => void;
}

const RANK_LABELS = ['Best Match', 'Great Alternative', 'Best Value'];
const RANK_COLORS = [
  'from-amber-400/20 to-yellow-500/10 text-amber-300 ring-amber-400/30',
  'from-sky-400/20 to-cyan-500/10 text-sky-300 ring-sky-400/30',
  'from-emerald-400/20 to-green-500/10 text-emerald-300 ring-emerald-400/30',
];

export default function Results({
  devices,
  category = 'Laptops',
  budget = 0,
  useCase,
  fallbackInfo,
  notice,
  onRestart,
  onRefine,
  onExploreFloor,
  onOpenHistory,
}: ResultsProps) {
  if (devices.length === 0) {
    const info = fallbackInfo || validateBudget(category, budget, useCase);
    const formattedBudget = `₹${budget.toLocaleString('en-IN')}`;
    const formattedFloor = `₹${info.floorPrice.toLocaleString('en-IN')}`;

    return (
      <section className="relative mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-[#0b1120] to-[#0b1120] p-6 sm:p-8 glass-strong shadow-2xl"
        >
          {/* Header icon */}
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-amber-400/40 bg-amber-400/10 text-amber-300 shadow-glow">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Budget Below Recommended Price Floor
          </h2>

          {/* Standard Fallback Response Message */}
          <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-center">
            <p className="font-display text-lg font-semibold text-amber-200">
              "{info.fallbackMessage}"
            </p>
            <p className="mt-1 text-xs text-amber-300/80">
              (Your budget: <span className="font-bold text-white">{formattedBudget}</span> vs Starting Floor: <span className="font-bold text-white">{formattedFloor}</span>)
            </p>
          </div>

          {/* Polite, Constructive Next Steps */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
              <HelpCircle className="h-4 w-4" />
              Helpful Next Steps:
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {info.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-300">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {onExploreFloor && (
              <button
                onClick={() => onExploreFloor(info.floorPrice)}
                className="btn-primary group"
              >
                <ArrowUpRight className="h-4 w-4" />
                Explore Options at ₹{info.floorPrice.toLocaleString('en-IN')}
              </button>
            )}
            <button onClick={onRefine} className="btn-ghost">
              <SlidersHorizontal className="h-4 w-4" />
              Adjust Budget / Filters
            </button>
            <button onClick={onRestart} className="btn-ghost">
              <RotateCcw className="h-4 w-4" />
              Start Over
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          AI-curated for you
        </div>
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          Your top <span className="neon-text">3 picks</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Ranked by how well each device matches your budget, use case, and priorities.
        </p>
      </motion.div>

      {/* Notice */}
      {notice && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 text-center font-display text-sm font-semibold text-amber-200">
          {notice}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {devices.map((device, idx) => (
          <motion.article
            key={device.name}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * idx, ease: 'easeOut' }}
            className={`group relative flex flex-col overflow-hidden rounded-3xl glass-strong transition-all duration-300 hover:shadow-glow ${
              idx === 0 ? 'md:scale-[1.03] md:ring-1 md:ring-cyan-400/30' : ''
            }`}
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={device.image_url}
                alt={device.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/40 to-transparent" />

              {/* Rank badge */}
              <div
                className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold ring-1 backdrop-blur-md ${RANK_COLORS[idx]}`}
              >
                {idx === 0 && <Trophy className="h-3.5 w-3.5" />}
                {RANK_LABELS[idx]}
              </div>

              {/* Match score */}
              <div className="absolute right-3 top-3 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                {device.matchScore}% match
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-bold leading-tight text-white">
                  {device.name}
                </h3>
                <div className="text-right">
                  <div className="font-display text-lg font-bold text-cyan-300">
                    ₹{device.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {device.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-slate-300"
                  >
                    <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                    {h}
                  </span>
                ))}
              </div>

              {/* Why this fits you */}
              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.07] to-violet-400/[0.04] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
                  <Tag className="h-3 w-3" />
                  Why this fits you
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                  {device.why_fits_you}
                </p>
              </div>

              {/* Key specs */}
              <div className="mt-4 space-y-1.5">
                {Object.entries(device.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500">{k}</span>
                    <span className="truncate text-right font-medium text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {onOpenHistory && (
          <button onClick={onOpenHistory} className="btn-ghost">
            <History className="h-4 w-4" />
            View Saved History
          </button>
        )}
        <button onClick={onRefine} className="btn-ghost">
          <RotateCcw className="h-4 w-4" />
          Refine my choices
        </button>
        <button onClick={onRestart} className="btn-primary group">
          Start over
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
