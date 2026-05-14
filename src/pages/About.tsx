import { motion } from 'framer-motion';
import { Bot, Cpu, Globe, Zap, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const milestones = [
    { year: '2025', event: 'Techendy Blueprint conceived in the cloud.', icon: <Bot /> },
    { year: '2026', event: 'Launched as a premier AI insights hub.', icon: <Globe /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-stone-300"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-7xl serif italic leading-[1.1]">Deciphering the <br />AI Revolution.</h1>
            <p className="text-xl text-stone-500 leading-relaxed max-w-2xl serif">
              Techendy is dedicated to decoding the complex world of artificial intelligence. We bring clarity to innovation, helping professionals and enthusiasts stay ahead of the curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="space-y-6">
              <div className="h-px w-full bg-stone-200"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Core Value 01.</div>
              <h3 className="text-2xl serif">Speed of Innovation</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                The AI landscape shifts daily. We provide real-time updates and deep dives into the tools that matter, from LLMs to autonomous agents.
              </p>
            </div>

            <div className="space-y-6">
              <div className="h-px w-full bg-stone-200"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Core Value 02.</div>
              <h3 className="text-2xl serif">Ethical Perspective</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                We don't just review features. We analyze the ethical implications and societal impact of emerging technologies.
              </p>
            </div>
          </div>

          <div className="space-y-12 pt-24 border-t border-stone-200">
            <h2 className="text-4xl serif italic">Our Journey</h2>
            <div className="space-y-16">
              {milestones.map((m) => (
                <div key={m.year} className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-stone-100 pb-8 last:border-0 group">
                  <div className="md:col-span-2 text-2xl font-bold tracking-tighter serif text-stone-300 group-hover:text-black transition-colors">{m.year}</div>
                  <div className="md:col-span-10 text-xl font-medium text-stone-600 leading-relaxed md:pl-8 border-l border-stone-200">
                    {m.event}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-20 text-center space-y-6">
             <h2 className="text-3xl font-bold">Join the Community</h2>
             <p className="text-muted-foreground">Techendy is more than a blog; it's a hub for everyone building the future.</p>
             <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                   <span className="text-3xl font-extrabold">10K+</span>
                   <span className="text-xs text-muted-foreground uppercase">Subscribers</span>
                </div>
                <div className="w-px h-12 bg-border mx-8" />
                <div className="flex flex-col items-center">
                   <span className="text-3xl font-extrabold">500+</span>
                   <span className="text-xs text-muted-foreground uppercase">Articles</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
