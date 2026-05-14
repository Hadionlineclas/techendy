import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db, collection, getDocs } from '@/lib/firebase';
import { Category } from '@/types';

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
      } catch (e) {
        console.error(e);
      }
    }
    fetchCategories();
  }, []);

  return (
    <footer className="bg-white border-t border-stone-200 py-16">
      <div className="container mx-auto px-4">
         <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="space-y-4">
            <div className="text-3xl font-bold tracking-tighter serif">Techendy.</div>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest max-w-[240px]">
              Techendy — the archive of generative tools and synthetic intelligence research.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Explore Categories</h3>
              <ul className="space-y-4">
                {categories.slice(0, 5).map((cat) => (
                  <motion.li 
                    key={cat.id || cat.slug}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="text-xs font-semibold text-stone-600 transition-colors hover:text-black origin-left"
                  >
                    <Link to={`/blog?cat=${cat.slug}`} className="flex items-center group">
                      <span className="h-px w-0 bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                      {cat.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Quick Access</h3>
              <ul className="space-y-3 text-xs font-semibold text-stone-600">
                <li><Link to="/" className="hover:text-black transition-colors">Home Page</Link></li>
                <li><Link to="/blog" className="hover:text-black transition-colors">The Archive</Link></li>
                <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Official Inquiries</h3>
              <ul className="space-y-3 text-xs font-semibold text-stone-600">
                <li><a href="mailto:hadionlineclas@gmail.com" className="hover:text-black transition-colors">hadionlineclas@gmail.com</a></li>
                <li><Link to="/contact" className="hover:text-black transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-stone-100 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
          <div>© 2026 Techendy Research. Developed for the synthetic era.</div>
          <div className="flex gap-8">
             <a href="mailto:hadionlineclas@gmail.com" className="hover:text-black transition-colors tracking-widest uppercase">Support Interface</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
