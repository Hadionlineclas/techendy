import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  FileText, 
  Layers, 
  Users, 
  Settings, 
  LayoutDashboard, 
  Plus, 
  Search,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminOverview from './AdminOverview';
import PostManager from './PostManager';
import PostEditor from './PostEditor';
import CategoryManager from './CategoryManager';
import UserManager from './UserManager';
import Analytics from './Analytics';
import SettingsPage from './Settings';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/layout/AIAssistant';

export default function AdminDashboard() {
  const { profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-20 text-center">Checking permissions...</div>;
  if (!isAdmin) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-4">
      <AlertCircle className="h-20 w-20 text-destructive" />
      <h1 className="text-4xl font-bold">Access Denied</h1>
      <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground mb-4">Techendy Admin Portal</h2>
      <p className="text-muted-foreground">You do not have administrative privileges to access this area.</p>
      <Button asChild><Link to="/">Return Home</Link></Button>
    </div>
  );

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'All Posts', path: '/admin/posts', icon: FileText },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background/50 backdrop-blur hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Management</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-border">
            <Button className="w-full justify-start rounded-lg" asChild>
              <Link to="/admin/new-post">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/posts" element={<PostManager />} />
          <Route path="/new-post" element={<PostEditor />} />
          <Route path="/edit-post/:id" element={<PostEditor />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/users" element={<UserManager />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<div>Module coming soon...</div>} />
        </Routes>
      </main>
      <AIAssistant />
    </div>
  );
}
