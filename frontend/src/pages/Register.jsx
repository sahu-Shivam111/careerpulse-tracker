import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all disabled:opacity-50 text-sm";
  const labelClass = "block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 px-4 py-6 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-slate-100 transition-all duration-300 hover:shadow-2xl">

        {/* Brand Header */}
        <div className="text-center mb-5 sm:mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-500 text-white text-xl sm:text-2xl shadow-lg shadow-brand-500/30 mb-3 sm:mb-4">
            💼
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm">Start tracking your job search today</p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-xs sm:text-sm animate-fade-in flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <input
                type="password"
                id="password"
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className={inputClass}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-500/20 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer text-sm mt-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Redirect Footer */}
        <p className="text-center text-slate-500 text-xs sm:text-sm mt-5 sm:mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-500 font-semibold hover:underline hover:text-brand-600 transition-colors"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
