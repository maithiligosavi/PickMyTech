import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Gamepad2,
  Briefcase,
  Clapperboard,
  Coffee,
  BatteryFull,
  MonitorSmartphone,
  Feather,
  Camera,
  Volume2,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Check,
  IndianRupee,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  CATEGORIES,
  USE_CASES,
  PRIORITIES,
} from '@/lib/catalog';
import type { Category, UseCase, Priority } from '@/lib/catalog';

const ICONS: Record<string, LucideIcon> = {
  Laptop, Smartphone, Headphones, Watch,
  Gamepad2, Briefcase, Clapperboard, Coffee,
  BatteryFull, MonitorSmartphone, Feather, Camera, Volume2, Cpu,
};

export interface FormState {
  category: Category;
  budget: number;
  useCase: UseCase;
  priorities: Priority[];
}

interface MultiStepFormProps {
  initial: FormState;
  onSubmit: (state: FormState) => void;
  onCancel: () => void;
}

const BUDGET_RANGES: Record<Category, [number, number, number]> = {
  // [min, max, default]
  Laptops: [30000, 300000, 120000],
  Smartphones: [10000, 150000, 60000],
  'Wireless Earbuds': [1000, 35000, 15000],
  Smartwatches: [2000, 100000, 25000],
};

export default function MultiStepForm({ initial, onSubmit, onCancel }: MultiStepFormProps) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category>(initial.category);
  const [budget, setBudget] = useState<number>(initial.budget);
  const [useCase, setUseCase] = useState<UseCase | null>(initial.useCase);
  const [priorities, setPriorities] = useState<Priority[]>(initial.priorities);

  const range = BUDGET_RANGES[category];

  const handleCategoryChange = (c: Category) => {
    setCategory(c);
    const r = BUDGET_RANGES[c];
    setBudget(r[2]);
  };

  const togglePriority = (p: Priority) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const canAdvance =
    step === 0 || (step === 1 && useCase !== null) || step === 2;

  const handleSubmit = () => {
    if (useCase) {
      onSubmit({ category, budget, useCase, priorities });
    }
  };

  const steps = ['Category & Budget', 'Use Case', 'Priorities'];

  return (
    <section className="relative mx-auto max-w-4xl px-4 pt-8 sm:px-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((label, idx) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex items-center gap-2.5">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                    idx < step
                      ? 'border-cyan-400 bg-cyan-400 text-[#090d16]'
                      : idx === step
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 neon-border'
                        : 'border-white/10 bg-white/[0.02] text-slate-500'
                  }`}
                >
                  {idx < step ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    idx <= step ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 transition-all duration-500 ${
                    idx < step ? 'bg-cyan-400/60' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 0: Category & Budget */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                What are you shopping for?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose a device category and set your budget range.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CATEGORIES.map((cat) => {
                  const Icon = ICONS[cat.icon] ?? Laptop;
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                        active
                          ? 'border-cyan-400/60 bg-cyan-400/10 shadow-glow'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                          active ? 'bg-cyan-400/20' : 'bg-white/[0.04]'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${active ? 'text-cyan-300' : 'text-slate-300'}`} />
                      </div>
                      <div className={`mt-3 text-sm font-semibold ${active ? 'text-white' : 'text-slate-300'}`}>
                        {cat.id}
                      </div>
                      {active && (
                        <motion.div
                          layoutId="cat-active"
                          className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-cyan-400/40"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Budget input */}
              <div className="mt-8">
                <label className="text-sm font-medium text-slate-300">
                  Your budget
                </label>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors focus-within:border-cyan-400/60 focus-within:ring-1 focus-within:ring-cyan-400/60">
                  <IndianRupee className="h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    value={budget || ''}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-transparent font-display text-lg font-bold text-white outline-none placeholder:text-slate-600"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Use Case */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                How will you use it?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Your primary use case shapes how we weight performance, battery, and features.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {USE_CASES.map((uc) => {
                  const Icon = ICONS[uc.icon] ?? Coffee;
                  const active = useCase === uc.id;
                  return (
                    <button
                      key={uc.id}
                      onClick={() => setUseCase(uc.id)}
                      className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                        active
                          ? 'border-cyan-400/60 bg-cyan-400/10 shadow-glow'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
                          active ? 'bg-cyan-400/20' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${active ? 'text-cyan-300' : 'text-slate-300'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-200'}`}>
                          {uc.id}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400">{uc.desc}</div>
                      </div>
                      {active && (
                        <div className="ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400 text-[#090d16]">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Priorities */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                What matters most?
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Pick any features you care about. You can choose multiple — or skip this step.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PRIORITIES.map((p) => {
                  const Icon = ICONS[p.icon] ?? Sparkles;
                  const active = priorities.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePriority(p.id)}
                      className={`group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-300 ${
                        active
                          ? 'border-cyan-400/60 bg-cyan-400/10 shadow-glow'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div
                          className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                            active ? 'bg-cyan-400/20' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${active ? 'text-cyan-300' : 'text-slate-300'}`} />
                        </div>
                        {active && (
                          <div className="grid h-5 w-5 place-items-center rounded-full bg-cyan-400 text-[#090d16]">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-300'}`}>
                        {p.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
          <div className="flex gap-2">
            {step > 0 ? (
              <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <button onClick={onCancel} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 2 ? (
              <button
                onClick={() => canAdvance && setStep((s) => s + 1)}
                disabled={!canAdvance}
                className="btn-primary"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary group">
                <Sparkles className="h-4 w-4" />
                Get my picks
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
