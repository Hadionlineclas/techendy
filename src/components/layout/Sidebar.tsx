import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { X, Home, BookOpen, Info, Mail, Cpu, Sparkles, Layers, Shield, Hash, Sliders } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db, collection, getDocs } from '@/lib/firebase';
import { Category } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
      } catch (e) {
        console.error("Sidebar Category Fetch Error:", e);
      }
    }
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <Link to="/" onClick={onClose} className="text-2xl font-bold tracking-tighter serif">Techendy.</Link>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {/* Navigation */}
              <div 
                className="space-y-4"
                onMouseEnter={() => setHoveredSection('nav')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 cursor-default flex items-center justify-between">
                  Navigation
                  <motion.span animate={{ rotate: hoveredSection === 'nav' ? 90 : 0 }} className="text-[8px] opacity-30">▶</motion.span>
                </h3>
                <motion.div 
                  initial={false}
                  animate={{ height: hoveredSection === 'nav' ? 'auto' : '0px', opacity: hoveredSection === 'nav' ? 1 : 0 }}
                  className="grid gap-2 overflow-hidden"
                >
                  <SidebarLink to="/" icon={<Home className="w-4 h-4" />} onClick={onClose}>Home</SidebarLink>
                  <SidebarLink to="/blog" icon={<BookOpen className="w-4 h-4" />} onClick={onClose}>Archive</SidebarLink>
                  <SidebarLink to="/about" icon={<Info className="w-4 h-4" />} onClick={onClose}>Mission</SidebarLink>
                  <SidebarLink to="/contact" icon={<Mail className="w-4 h-4" />} onClick={onClose}>Contact</SidebarLink>
                </motion.div>
                {!hoveredSection && <div className="h-0.5 w-8 bg-stone-100 rounded-full" />}
              </div>

              {/* Categories */}
              <div 
                className="space-y-4"
                onMouseEnter={() => setHoveredSection('cats')}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 cursor-default flex items-center justify-between">
                  Research Layers
                  <motion.span animate={{ rotate: hoveredSection === 'cats' ? 90 : 0 }} className="text-[8px] opacity-30">▶</motion.span>
                </h3>
                <motion.div 
                  initial={false}
                  animate={{ height: hoveredSection === 'cats' ? 'auto' : '0px', opacity: hoveredSection === 'cats' ? 1 : 0 }}
                  className="grid gap-2 overflow-hidden"
                >
                  {categories.map((cat) => (
                    <SidebarLink 
                      key={cat.id || cat.slug} 
                      to={`/blog?cat=${cat.slug}`} 
                      icon={<Hash className="w-4 h-4" />}
                      onClick={onClose}
                    >
                      {cat.name}
                    </SidebarLink>
                  ))}
                </motion.div>
                {!hoveredSection && <div className="h-0.5 w-8 bg-stone-100 rounded-full" />}
              </div>

              {isAdmin && (
                <div 
                  className="space-y-4"
                  onMouseEnter={() => setHoveredSection('admin')}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 cursor-default flex items-center justify-between">
                    Administration
                    <motion.span animate={{ rotate: hoveredSection === 'admin' ? 90 : 0 }} className="text-[8px] opacity-30">▶</motion.span>
                  </h3>
                  <motion.div 
                    initial={false}
                    animate={{ height: hoveredSection === 'admin' ? 'auto' : '0px', opacity: hoveredSection === 'admin' ? 1 : 0 }}
                    className="grid gap-2 overflow-hidden"
                  >
                    <SidebarLink to="/admin" icon={<Cpu className="w-4 h-4" />} onClick={onClose}>Overview</SidebarLink>
                    <SidebarLink to="/admin/posts" icon={<Layers className="w-4 h-4" />} onClick={onClose}>Manage Content</SidebarLink>
                    <SidebarLink to="/admin/new-post" icon={<Sparkles className="w-4 h-4" />} onClick={onClose}>AI Studio</SidebarLink>
                    <SidebarLink to="/admin/settings" icon={<Sliders className="w-4 h-4" />} onClick={onClose}>Portal Config</SidebarLink>
                  </motion.div>
                  {!hoveredSection && <div className="h-0.5 w-8 bg-stone-100 rounded-full" />}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-stone-100 italic text-[10px] text-stone-400 text-center">
              Techendy Research Interface v2.0
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarLink = ({ to, icon, children, onClick }: { to: string, icon: React.ReactNode, children: React.ReactNode, onClick: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:text-black hover:bg-stone-50 transition-all group"
  >
    <span className="text-stone-400 group-hover:text-black transition-colors">{icon}</span>
    <span className="text-sm font-semibold">{children}</span>
  </Link>
);
