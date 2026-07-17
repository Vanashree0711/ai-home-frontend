import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'success'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('reset');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token: 'mock-reset-token-123', new_password: newPassword });
      setStep('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 rounded-3xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-3xl font-display font-bold mb-2 text-center">Reset Password</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 'email' && (
          <>
            <p className="text-sm text-gray-soft text-center mb-6">Enter your registered email address to continue.</p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
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
              <button type="submit" disabled={loading} className="bg-[#D4AF37] text-[#0A192F] font-bold py-3 rounded-xl mt-4 hover:bg-[#F5E6A3] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-60">
                {loading ? 'Verifying...' : 'Continue to Reset'}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <div className="bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-center mb-6 text-sm">
              ✅ Email verified! Enter your new password below.
            </div>
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-soft mb-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full bg-[#0A192F] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="bg-[#D4AF37] text-[#0A192F] font-bold py-3 rounded-xl mt-4 hover:bg-[#F5E6A3] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-60">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <div className="bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-center mb-4">
              Password updated successfully! Redirecting you to Login in 3 seconds...
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-[#D4AF37] hover:underline">
            ← Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
