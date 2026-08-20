import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
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
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-gold hover:scale-105 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-gold" />}
          </button>

          {/* Always visible — no login needed */}
          <div className="hidden sm:flex gap-3 sm:gap-4 items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 transition-colors text-sm text-pearl"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/studio"
              className="bg-gold text-primary px-5 py-2 rounded-full font-semibold hover:bg-gold-light transition-colors"
            >
              Design Now
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full md:hidden border border-white/10 hover:bg-white/5 text-pearl"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 text-center">
          <Link to="/features" className="text-gray-soft hover:text-pearl py-2 font-medium" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/gallery" className="text-gray-soft hover:text-pearl py-2 font-medium" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/pricing" className="text-gray-soft hover:text-pearl py-2 font-medium" onClick={() => setIsOpen(false)}>Pricing</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5 sm:hidden">
            <Link to="/dashboard" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-pearl" onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/studio" className="bg-gold text-primary py-3 rounded-xl font-semibold" onClick={() => setIsOpen(false)}>
              Design Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
