import { motion } from 'framer-motion';
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
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES, USE_CASES, PRIORITIES } from '@/lib/catalog';
import type { Category } from '@/lib/catalog';

const ICONS: Record<string, LucideIcon> = {
  Laptop, Smartphone, Headphones, Watch,
  Gamepad2, Briefcase, Clapperboard, Coffee,
  BatteryFull, MonitorSmartphone, Feather, Camera, Volume2, Cpu,
};

interface HeroProps {
  onPickCategory: (c: Category) => void;
}

export default function Hero({ onPickCategory }: HeroProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-20">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-3xl text-center"
      >


        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white text-balance sm:text-6xl">
          Find your perfect{' '}
          <span className="neon-text animate-gradient-x">tech hardware</span>
          <br className="hidden sm:block" /> in three smart steps
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg text-balance">
          PickMyTech evaluates real hardware specs with Gemini AI,
          and recommends the top 3 devices that fit your budget and needs — with a tailored
          rationale for each.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onPickCategory('Laptops')}
            className="btn-primary group"
          >
            <Zap className="h-4 w-4" />
            Get my recommendations
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a href="#categories" className="btn-ghost">
            Browse categories
          </a>
        </div>
      </motion.div>

      {/* Category cards */}
      <div id="categories" className="mt-20 scroll-mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Pick a category to start
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Each recommendation is tailored to the device type you choose.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, idx) => {
            const Icon = ICONS[cat.icon] ?? Laptop;
            return (
              <motion.button
                key={cat.id}
                onClick={() => onPickCategory(cat.id)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * idx, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl glass glass-hover p-6 text-left"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-sky-500/10 ring-1 ring-cyan-400/20">
                    <Icon className="h-6 w-6 text-cyan-300" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {cat.id}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{cat.blurb}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Start here <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="mt-20 scroll-mt-24">
        <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { n: '01', t: 'Tell us your needs', d: 'Pick a category, set your budget, choose a use case and the features that matter most.', icon: SlidersIcon },
            { n: '02', t: 'AI analyzes the market', d: 'Gemini AI generates personalized tech recommendations based on user preferences and budget.', icon: BrainIcon },
            { n: '03', t: 'Compare your top 3', d: 'Get three tailored picks with a side-by-side comparison matrix and a "Why this fits you" tag.', icon: TrophyIcon },
          ].map((step, idx) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.05 * idx }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-bold text-cyan-400">{step.n}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent" />
                <step.icon className="h-5 w-5 text-slate-300" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{step.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature pills preview */}
      <div className="mt-20">
        <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
          Tuned to what matters to you
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-400">
          Prioritize the features you care about. Our scoring engine weights every device accordingly.
        </p>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {[...USE_CASES.map((u) => ({ ...u, kind: 'use' })), ...PRIORITIES.map((p) => ({ ...p, kind: 'pri' }))].map((item) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <span key={item.id} className="chip">
                <Icon className="h-3.5 w-3.5 text-cyan-400" />
                {item.id}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SlidersIcon(props: { className?: string }) {
  return <Cpu {...props} />;
}
function BrainIcon(props: { className?: string }) {
  return <Sparkles {...props} />;
}
function TrophyIcon(props: { className?: string }) {
  return <Zap {...props} />;
}
