import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Zap, Shield, Search, TrendingUp, Cpu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db, collection, getDocs, query, orderBy, limit, where } from '@/lib/firebase';
import { Post, Category } from '@/types';
import { Helmet } from 'react-helmet-async';
import { AdUnit } from '@/components/ui/AdUnit';

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(12) // 4x3 grid
        );
        const [postsSnap, catsSnap] = await Promise.all([
          getDocs(postsQuery),
          getDocs(collection(db, 'categories'))
        ]);
        
        const postsData = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setLatestPosts(postsData);
        setCategories(catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Helmet>
        <title>Techendy | Archive of Generative Tools & Virtual Worlds</title>
        <meta name="description" content="The definitive repository for generative AI tools, procedural environments, and technical insights into virtual worlds." />
      </Helmet>

      {/* Editorial Mascot Background */}
      <div className="robot-bg hidden lg:block opacity-[0.04]">
        <Bot className="w-[800px] h-[800px] text-stone-900" strokeWidth={0.5} />
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden border-b border-stone-200">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="h-px w-8 bg-stone-300"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Techendy Research • 2026</span>
                <span className="h-px w-8 bg-stone-300"></span>
              </div>
              <h1 className="text-4xl md:text-7xl lg:text-[90px] leading-tight md:leading-[80px] text-center serif mb-8">
                The Archive of <br />
                <span className="italic text-stone-900">Generative Tools</span> & <br />
                <span className="font-light text-black">Virtual Worlds</span>.
              </h1>
              <p className="text-[20px] leading-[33px] text-center text-stone-500 font-medium max-w-2xl mb-12 mx-auto">
                A curated repository dedicated to the evolution of procedural generation, neural environments, and the tools shaping our synthetic future.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-stone-800 text-[10px] uppercase font-bold tracking-widest leading-none h-12 min-w-[140px]" asChild>
                  <Link to="/blog">Blog Entry</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 border-stone-300 text-[10px] uppercase font-bold tracking-widest leading-none h-12 min-w-[140px]" asChild>
                  <Link to="/about">About Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trending Articles Section (4x3 Grid) */}
        <section className="container mx-auto px-4 py-24 border-b border-stone-200">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">Editor's Selection</h2>
              <h3 className="text-4xl serif italic">Trending Articles</h3>
            </div>
            <Link to="/blog" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-black transition-colors">Complete Archive</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {latestPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-[3/4] bg-stone-100 rounded-2xl mb-6 overflow-hidden relative border border-stone-200 shadow-sm transition-all group-hover:shadow-xl">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                          <Bot className="h-20 w-20" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                         <span className="text-white text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Zap className="h-3 w-3 text-yellow-400" />
                           Read Insight
                         </span>
                      </div>
                    </div>
                    <h3 className="text-xl serif leading-tight mb-2 group-hover:underline underline-offset-4 decoration-1">{post.title}</h3>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-[8px] uppercase tracking-tighter opacity-50">{post.categoryId || 'General'}</Badge>
                    </div>
                  </Link>
                </motion.div>
             ))}
          </div>

          {latestPosts.length === 0 && !loading && (
             <div className="py-20 text-center text-stone-400 italic">No entries found in the archive.</div>
          )}
        </section>

        {/* Content Layers Section */}
        <section className="bg-stone-50 py-24 border-b border-stone-200">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                 <div className="lg:col-span-5 space-y-8">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Content Layers</h2>
                    <h3 className="text-5xl serif italic leading-[1.1]">Navigate the Research.</h3>
                    <p className="text-stone-500 leading-relaxed max-w-md">Our research is organized into primary layers of intelligence. Each layer represents a different facet of the synthetic era.</p>
                 </div>
                 <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.slice(0, 4).map((cat, i) => (
                       <Link key={cat.id} to={`/blog?cat=${cat.slug}`} className="block p-8 bg-white border border-stone-200 rounded-3xl hover:border-black transition-all group">
                          <div className="text-[10px] font-mono text-stone-300 mb-6">{`0${i+1}.`}</div>
                          <h4 className="text-2xl serif group-hover:pl-2 transition-all">{cat.name}</h4>
                          <div className="mt-8 flex justify-end">
                             <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-4 w-4" />
                             </div>
                          </div>
                       </Link>
                    ))}
                    {categories.length < 4 && (
                      <div className="col-span-full py-4 text-xs text-stone-400 italic">More layers being indexed...</div>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* Strategic Verticals Section */}
        <section className="py-24 border-b border-stone-200">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Strategic Verticals</h2>
                <h3 className="text-5xl serif italic">The Domain Focus.</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <motion.div 
                   whileHover={{ y: -5 }}
                   className="p-12 rounded-[40px] bg-stone-900 text-white relative overflow-hidden group h-[400px] flex flex-col justify-between"
                 >
                    <div className="relative z-10">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4 block">Vertical 01</span>
                       <h4 className="text-4xl serif italic mb-6">Neural Gaming &<br/>Virtual Worlds</h4>
                       <p className="text-stone-400 max-w-sm leading-relaxed">Exploring AI-driven procedural generation, autonomous NPCs, and the evolution of player agency in hyper-realistic environments.</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                       <Link to="/blog?cat=gaming" className="text-xs font-bold uppercase tracking-widest hover:text-stone-300 flex items-center gap-2">
                          Explore Gaming Archive <ArrowRight className="h-3 w-3" />
                       </Link>
                    </div>
                    <Bot className="absolute -right-20 -bottom-20 w-64 h-64 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                 </motion.div>

                 <motion.div 
                   whileHover={{ y: -5 }}
                   className="p-12 rounded-[40px] border border-stone-200 hover:border-black transition-colors relative overflow-hidden group h-[400px] flex flex-col justify-between"
                 >
                    <div className="relative z-10">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 block">Vertical 02</span>
                       <h4 className="text-4xl serif italic mb-6">Quantum Computing &<br/>Tech Infrastructure</h4>
                       <p className="text-stone-500 max-w-sm leading-relaxed">Analyzing the hardware layer that makes the generative era possible—from tensor cores to upcoming quantum breakthroughs.</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                       <Link to="/blog?cat=tech" className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          View Infrastructure Log <ArrowRight className="h-3 w-3" />
                       </Link>
                    </div>
                    <Cpu className="absolute -right-20 -bottom-20 w-64 h-64 text-black/[0.03] group-hover:-rotate-12 transition-transform duration-700" />
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Explore Categories Section */}
        <section className="container mx-auto px-4 py-32 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
             <div className="flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-stone-300"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Discover</span>
                <span className="h-px w-8 bg-stone-300"></span>
             </div>
             <h2 className="text-4xl md:text-5xl serif italic">The Future is Virtual.</h2>
             <p className="text-stone-500 leading-relaxed">
               Techendy serves as a technical ledger for the generative era. Explore the archives and discover the architects of the virtual world.
             </p>
             <div className="flex flex-wrap justify-center gap-8 pt-4">
               {categories.map(cat => (
                  <Link key={cat.id} to={`/blog?cat=${cat.slug}`} className="text-xs font-bold uppercase tracking-widest hover:text-black transition-colors decoration-1 underline-offset-8 underline decoration-stone-200 hover:decoration-black">{cat.name}</Link>
               ))}
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
