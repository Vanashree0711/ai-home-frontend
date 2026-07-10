import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark'; // default to premium dark mode
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Sparkles className="text-gold w-6 h-6" />
          <span className="font-display font-bold text-xl tracking-wide text-pearl">AI HOME</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-soft">
          <Link to="/features" className="hover:text-pearl transition-colors">Features</Link>
          <Link to="/gallery" className="hover:text-pearl transition-colors">Gallery</Link>
          <Link to="/pricing" className="hover:text-pearl transition-colors">Pricing</Link>
        </div>
        
        {/* Navigation Actions */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-gold hover:scale-105 transition-all"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-gold" />}
          </button>

          {/* User Controls (Desktop & Tablet) */}
          <div className="hidden sm:flex gap-3 sm:gap-4 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm text-pearl">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-colors text-sm text-pearl">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-pearl">Log in</Link>
                <Link to="/login" className="bg-gold text-primary px-5 py-2 rounded-full font-semibold hover:bg-gold-light transition-colors">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle (Phones & Tablets) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 rounded-full md:hidden border border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-pearl"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 text-center">
          <Link to="/features" className="text-gray-soft hover:text-pearl py-2 font-medium" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/gallery" className="text-gray-soft hover:text-pearl py-2 font-medium" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/pricing" className="text-gray-soft hover:text-pearl py-2 font-medium" onClick={() => setIsOpen(false)}>Pricing</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5 sm:hidden">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-pearl" onClick={() => setIsOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/30 text-red-400">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-3 rounded-xl bg-white/5 text-pearl" onClick={() => setIsOpen(false)}>Log in</Link>
                <Link to="/login" className="bg-gold text-primary py-3 rounded-xl font-semibold" onClick={() => setIsOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
