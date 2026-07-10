import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-3xl font-display font-bold mb-6 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-soft mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-primary-light border border-white/20 rounded-xl px-4 py-3 text-pearl focus:border-gold focus:outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-soft mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-primary-light border border-white/20 rounded-xl px-4 py-3 text-pearl focus:border-gold focus:outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-sm text-[#D4AF37] hover:underline">Forgot password?</Link>
            </div>
          </div>
          <button type="submit" className="bg-gold text-primary font-bold py-3 rounded-xl mt-4 hover:bg-gold-light transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-soft">
          Don't have an account? <Link to="/signup" className="text-gold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
