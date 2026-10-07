import { motion } from 'framer-motion';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#090d16]">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090d16] via-[#0b1120] to-[#090d16]" />

      {/* Neon blobs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[120px] animate-blob"
        aria-hidden
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-[120px] animate-blob"
        style={{ animationDelay: '4s' }}
        aria-hidden
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-sky-500/15 blur-[120px] animate-blob"
        style={{ animationDelay: '8s' }}
        aria-hidden
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(9,13,22,0.8) 100%)' }}
        aria-hidden
      />
    </div>
  );
}
