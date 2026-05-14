import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import PostDetail from '@/pages/PostDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { AdminRoute } from '@/components/auth/AdminRoute';

export default function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('techendy-cookie-consent');
    
    if (!hasConsented) {
      setTimeout(() => setShowCookieConsent(true), 2000);
    }
  }, []);

  const handleCookieConsent = () => {
    localStorage.setItem('techendy-cookie-consent', 'true');
    setShowCookieConsent(false);
  };

  const handlePrivacyClose = () => {
    localStorage.setItem('techendy-privacy-popup', 'true');
    setShowPrivacyPopup(false);
  };

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="flex bg-background font-sans antialiased min-h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex flex-col flex-grow min-w-0">
              <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<PostDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>

            {/* Cookie Consent Banner */}
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
