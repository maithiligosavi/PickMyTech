import { motion } from 'framer-motion';
import { GitCompare } from 'lucide-react';
import type { Device } from '@/lib/catalog';

interface ComparisonMatrixProps {
  devices: Device[];
}

export default function ComparisonMatrix({ devices }: ComparisonMatrixProps) {
  // Gather all spec keys across devices, preserving order of first device
  const keys: string[] = [];
  for (const d of devices) {
    for (const k of Object.keys(d.specs)) {
      if (!keys.includes(k)) keys.push(k);
    }
  }
  // Always include Price at the top
  const rows = ['Price', ...keys];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6"
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-sky-500/10 ring-1 ring-cyan-400/20">
          <GitCompare className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
            Side-by-side comparison
          </h2>
          <p className="text-xs text-slate-400">
            Compare key hardware parameters across your top 3 picks.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin rounded-3xl glass-strong">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-32 bg-[#0b1120]/80 p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 backdrop-blur-xl">
                Spec
              </th>
              {devices.map((d, idx) => (
                <th
                  key={d.name}
                  className={`p-4 text-left align-top ${
                    idx === 0 ? 'bg-cyan-400/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold ${
                        idx === 0
                          ? 'bg-amber-400/20 text-amber-300'
                          : idx === 1
                            ? 'bg-sky-400/20 text-sky-300'
                            : 'bg-emerald-400/20 text-emerald-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-display text-sm font-bold leading-tight text-white">
                      {d.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((key, rowIdx) => (
              <tr
                key={key}
                className={`border-t border-white/[0.05] ${
                  rowIdx === 0 ? 'bg-cyan-400/[0.03]' : ''
                }`}
              >
                <td className="sticky left-0 z-10 bg-[#0b1120]/80 p-4 text-xs font-medium uppercase tracking-wide text-slate-500 backdrop-blur-xl">
                  {key}
                </td>
                {devices.map((d, idx) => {
                  const value =
                    key === 'Price'
                      ? `₹${d.price.toLocaleString('en-IN')}`
                      : (d.specs[key] ?? '—');
                  const isPrice = key === 'Price';
                  return (
                    <td
                      key={d.name + key}
                      className={`p-4 align-top ${
                        idx === 0 ? 'bg-cyan-400/[0.03]' : ''
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          isPrice
                            ? 'font-display font-bold text-cyan-300'
                            : 'font-medium text-slate-200'
                        }`}
                      >
                        {value}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
