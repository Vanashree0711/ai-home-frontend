import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-3xl font-display font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-gray-soft text-center mb-6">Enter your email and we'll send you a link.</p>
        
        {submitted ? (
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              // Using mock token for hackathon demo
              await api.post('/auth/reset-password', { token: 'mock-reset-token-123', new_password: newPassword });
              window.location.href = '/login';
            } catch (err) {
              console.error(err);
            }
          }} className="flex flex-col gap-4">
            <div className="bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-center mb-2">
              For demo purposes, the email step is bypassed. Enter a new password below.
            </div>
            <div>
              <label className="block text-sm text-gray-soft mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full bg-[#0A192F] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="bg-[#D4AF37] text-[#0A192F] font-bold py-3 rounded-xl mt-4 hover:bg-[#F5E6A3] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Update Password
            </button>
          </form>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api.post('/auth/forgot-password', { email });
              setSubmitted(true);
            } catch (err) {
              console.error(err);
            }
          }} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-soft mb-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-[#0A192F] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="bg-[#D4AF37] text-[#0A192F] font-bold py-3 rounded-xl mt-4 hover:bg-[#F5E6A3] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Send Reset Link
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-[#D4AF37] hover:underline">
            &larr; Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
