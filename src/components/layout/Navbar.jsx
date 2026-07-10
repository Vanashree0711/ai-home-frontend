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
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-gold w-6 h-6" />
          <span className="font-display font-bold text-xl tracking-wide text-pearl">AI HOME</span>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-soft">
          <Link to="/features" className="hover:text-pearl transition-colors">Features</Link>
          <Link to="/gallery" className="hover:text-pearl transition-colors">Gallery</Link>
          <Link to="/pricing" className="hover:text-pearl transition-colors">Pricing</Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-gold hover:scale-105 transition-all"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-gold" />}
          </button>

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
      </div>
    </nav>
  );
};

export default Navbar;
