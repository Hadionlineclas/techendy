import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Search, Menu, X, LayoutDashboard, User, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const { user, profile, isAdmin, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenSidebar}
            className="hover:bg-stone-100 rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tighter serif">Techendy.</span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-8 text-[10px] font-bold uppercase tracking-widest-extra text-stone-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-black transition-colors">Blog</Link>
            <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-black transition-colors">Privacy</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-48">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-stone-400" />
            <input
              type="search"
              placeholder="Search Archive..."
              className="w-full bg-stone-100/50 border border-stone-200 pl-8 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full focus:ring-1 focus:ring-stone-400 outline-none transition-all"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="hidden md:flex rounded-full border-stone-200 text-[10px] font-bold uppercase tracking-widest">
                  <Link to="/admin">
                    Admin Panel
                  </Link>
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.photoURL} alt={profile?.displayName} />
                      <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/new-post">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={() => signIn()} size="sm" className="rounded-full px-6 bg-black text-white hover:bg-stone-800 text-[10px] font-bold uppercase tracking-widest leading-none">
              Login
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => (document.querySelector('input[type="search"]') as HTMLInputElement)?.focus()}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/blog" className="block text-sm font-medium py-2">Blog</Link>
              <Link to="/tools" className="block text-sm font-medium py-2">AI Tools</Link>
              <Link to="/about" className="block text-sm font-medium py-2">About</Link>
              <div className="pt-4 border-t">
                 <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search AI tools..."
                    className="w-full bg-muted pl-9 py-2 text-sm rounded-md border-none focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
