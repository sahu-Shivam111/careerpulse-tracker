import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // 1. Basic validation
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Trigger auth action
      await loginUser(email, password);
      // 3. Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Handle network or invalid credentials error
      const message = err.response?.data?.message || 'Failed to login. Please check your credentials.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-slate-100 transition-all duration-300 hover:shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white text-xl sm:text-2xl shadow-lg shadow-brand-500/30 mb-3 sm:mb-4">
            💼
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm">Log in to track your career goals</p>
        </div>

        {/* Error Alert Box */}
        {formError && (
          <div className="mb-5 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-xs sm:text-sm animate-fade-in flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all disabled:opacity-50 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all disabled:opacity-50 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-500/20 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Redirect Footer */}
        <p className="text-center text-slate-500 text-xs sm:text-sm mt-6 sm:mt-8">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-500 font-semibold hover:underline hover:text-brand-600 transition-colors"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
