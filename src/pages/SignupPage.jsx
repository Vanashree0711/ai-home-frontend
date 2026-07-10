import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-3xl font-display font-bold mb-6 text-center">Create Account</h2>
        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-400 p-3 rounded-xl text-center mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-soft mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-primary-light border border-white/20 rounded-xl px-4 py-3 text-pearl focus:border-gold focus:outline-none transition-colors"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
          </div>
          <button type="submit" className="bg-gold text-primary font-bold py-3 rounded-xl mt-4 hover:bg-gold-light transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-soft">
          Already have an account? <Link to="/login" className="text-gold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
