import { Github, Heart, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="relative mt-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display text-sm font-semibold text-white">
              PickMyTech
            </p>
            <p className="mt-1 text-xs text-slate-500">
              AI-powered tech hardware recommendations.
            </p>
          </div>


        </div>


      </div>
    </footer>
  );
}
