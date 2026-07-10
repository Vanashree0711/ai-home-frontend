import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl px-4"
      >
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight">
          Redefine Your Space with <span className="text-gradient">AI Precision</span>
        </h1>
        <p className="text-xl text-gray-soft mb-10 max-w-2xl mx-auto">
          Experience luxury interior design powered by cutting-edge artificial intelligence. Transform your empty rooms into photorealistic masterpieces in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/studio" className="glass-panel px-8 py-4 rounded-full flex items-center gap-2 hover:bg-gold hover:text-primary transition-all duration-300 font-semibold group">
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            Start Designing
          </Link>
          <Link to="/gallery" className="px-8 py-4 rounded-full flex items-center gap-2 border border-white/20 hover:border-white/50 transition-all duration-300">
            <ImageIcon className="w-5 h-5" />
            View Gallery
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
