import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import jobService from '../services/jobService';

const StatCard = ({ label, value, emoji, colorClass, bgClass }) => (
  <div className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group`}>
    <div className={`absolute top-0 right-0 w-20 h-20 ${bgClass} rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-300`}></div>
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-xl">{emoji}</span>
    </div>
    <span className={`text-4xl font-extrabold ${colorClass}`}>{value}</span>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard statistics. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="h-7 w-36 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-56 bg-slate-100 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                <div className="h-3 w-16 bg-slate-200 rounded mb-4"></div>
                <div className="h-8 w-10 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm">Real-time breakdown of your job application cycles</p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-500/15 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>＋</span> Add Application
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Metrics Grid — 2 cols on mobile, 3 on sm, 5 on lg */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Apps"  value={stats.total}     emoji="📊" colorClass="text-slate-800"   bgClass="bg-slate-100/60" />
            <StatCard label="Applied"     value={stats.applied}   emoji="📨" colorClass="text-amber-600"   bgClass="bg-amber-50" />
            <StatCard label="Interviews"  value={stats.interview} emoji="🤝" colorClass="text-indigo-600"  bgClass="bg-indigo-50" />
            <StatCard label="Offers"      value={stats.offer}     emoji="🎉" colorClass="text-emerald-600" bgClass="bg-emerald-50" />
            <StatCard label="Rejected"    value={stats.rejected}  emoji="❌" colorClass="text-rose-600"    bgClass="bg-rose-50" />
          </div>
        )}

        {/* Empty State */}
        {stats && stats.total === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-14 text-center max-w-xl mx-auto mt-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-50 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-5">
              🚀
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">No Job Applications Yet</h3>
            <p className="text-slate-500 text-sm mb-6 sm:mb-8">
              Start tracking your applications to organize your job search!
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer text-sm"
            >
              Add Your First Job
            </button>
          </div>
        )}

        {/* Quick Tips */}
        {stats && stats.total > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-4 flex items-center gap-2">
              <span>💡</span> Career Search Quick Tips
            </h4>
            <ul className="text-xs sm:text-sm text-slate-500 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold shrink-0 mt-0.5">•</span>
                <span><strong className="text-slate-700">Keep status updated:</strong> Move applications from <em>Applied</em> to <em>Interview</em> as soon as you hear back.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold shrink-0 mt-0.5">•</span>
                <span><strong className="text-slate-700">Take notes:</strong> Document interview questions, panel names, and follow-up timelines in each job's notes field.</span>
              </li>
            </ul>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
