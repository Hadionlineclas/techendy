import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received! Our AI agents will route this to the right human.");
  };

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-stone-300"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Communication</span>
              </div>
              <h1 className="text-4xl md:text-7xl serif italic leading-[1.1]">Initiate a <br />Conversation.</h1>
              <p className="text-xl text-stone-500 leading-relaxed max-w-2xl">
                Have a question about a specific AI tool? Or want to collaborate on a feature? Reach out to the Techendy research group.
              </p>
            </motion.div>

            <div className="space-y-12 pt-12 border-t border-stone-200">
              <div className="flex items-start gap-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-1">01.</div>
                <div>
                  <h3 className="text-xl serif italic mb-1">Electronic Mail</h3>
                  <p className="text-stone-500 text-sm font-medium">frontdesk@techendy.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-1">02.</div>
                <div>
                  <h3 className="text-xl serif italic mb-1">Neural Headquarters</h3>
                  <p className="text-stone-500 text-sm font-medium leading-relaxed">Virtual Office 404, Silicon Valley<br />Available Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white border border-stone-100 rounded-2xl shadow-2xl p-10 space-y-8">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Dispatch Form</div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Identity</Label>
                    <Input id="name" placeholder="John Doe" className="border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Electronic Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Subject Matter</Label>
                  <Input id="subject" placeholder="Collaboration / Feedback" className="border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Abstract</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px] border-0 border-b border-stone-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-all bg-transparent resize-none" />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full bg-black text-white hover:bg-stone-800 text-[10px] font-bold uppercase tracking-widest h-12">
                  Transmit Data
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
