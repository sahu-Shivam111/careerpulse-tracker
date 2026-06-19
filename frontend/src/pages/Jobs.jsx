import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import jobService from '../services/jobService';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentJobId, setCurrentJobId] = useState(null);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobs = async (searchVal = search, filterVal = statusFilter) => {
    try {
      setLoading(true);
      const data = await jobService.getAllJobs(searchVal, filterVal);
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch job applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setCompany('');
    setPosition('');
    setStatus('Applied');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setModalMode('edit');
    setCurrentJobId(job.id);
    setCompany(job.company);
    setPosition(job.position);
    setStatus(job.status);
    setAppliedDate(job.applied_date ? job.applied_date.split('T')[0] : '');
    setNotes(job.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!company || !position || !appliedDate) {
      setFormError('Company name, position, and applied date are required.');
      return;
    }
    const jobData = { company, position, status, applied_date: appliedDate, notes };
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        await jobService.createJob(jobData);
      } else {
        await jobService.updateJob(currentJobId, jobData);
      }
      fetchJobs();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to save job application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await jobService.deleteJob(id);
        fetchJobs();
      } catch (err) {
        console.error(err);
        alert('Failed to delete the job application.');
      }
    }
  };

  const getStatusBadge = (jobStatus) => {
    const badges = {
      Applied:   'bg-amber-50 text-amber-700 border-amber-200',
      Interview: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Offer:     'bg-emerald-50 text-emerald-700 border-emerald-200',
      Rejected:  'bg-rose-50 text-rose-700 border-rose-200',
    };
    return badges[jobStatus] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Job Applications</h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm">Organize and monitor your applications</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-500/15 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>＋</span> New Application
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 mb-6 sm:mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
            {/* Search Row */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                🔍
              </button>
            </div>
            {/* Filter Row */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              {(search || statusFilter) && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setStatusFilter(''); fetchJobs('', ''); }}
                  className="px-3 py-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm flex items-start gap-2">
            <span className="shrink-0">⚠️</span><span>{error}</span>
          </div>
        )}

        {/* Job List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-24 animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center max-w-sm mx-auto">
            <span className="text-4xl">📂</span>
            <h3 className="text-lg font-bold text-slate-800 mt-4 mb-1">No Applications Found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters or add a new application.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table — md and up */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-xs font-bold">
                  <tr>
                    <th className="px-5 py-4">Company</th>
                    <th className="px-5 py-4">Position</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Applied Date</th>
                    <th className="px-5 py-4">Notes</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">{job.company}</td>
                      <td className="px-5 py-4 font-medium">{job.position}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(job.applied_date)}</td>
                      <td className="px-5 py-4 max-w-xs truncate text-slate-400" title={job.notes}>
                        {job.notes || '—'}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1">
                        <button onClick={() => handleOpenEdit(job)} className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-lg transition-all cursor-pointer">Edit</button>
                        <button onClick={() => handleDelete(job.id)} className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards — below md */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* Card Header with color accent */}
                  <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-base leading-tight truncate">{job.company}</p>
                      <p className="text-sm text-slate-600 font-medium mt-0.5 truncate">{job.position}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Date & Notes */}
                  <div className="px-4 pb-3">
                    <p className="text-xs text-slate-400">Applied: {formatDate(job.applied_date)}</p>
                    {job.notes && (
                      <p className="mt-2 text-xs text-slate-500 italic bg-slate-50 rounded-lg p-2.5 border border-slate-100 line-clamp-2">
                        {job.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="flex-1 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-50 active:bg-brand-100 transition-colors cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <div className="w-px bg-slate-100"></div>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="flex-1 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors cursor-pointer"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          {/* 
            On mobile: slides up from bottom like a bottom sheet (rounded top corners only).
            On sm+: centered dialog with all rounded corners.
          */}
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">

            {/* Drag Handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
            </div>

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {modalMode === 'create' ? '➕ Add Job Application' : '✏️ Edit Job Application'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer p-1">✕</button>
            </div>

            {/* Modal Form — scrollable */}
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-y-auto">
              <div className="p-5 space-y-4 flex-1">

                {formError && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-xs flex items-start gap-2">
                    <span className="shrink-0">⚠️</span><span>{formError}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="modal-company" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="modal-company"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="modal-position" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="modal-position"
                    placeholder="e.g. Software Engineer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="modal-status" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      id="modal-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="modal-date" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Date Applied *
                    </label>
                    <input
                      type="date"
                      id="modal-date"
                      value={appliedDate}
                      onChange={(e) => setAppliedDate(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-notes" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Notes / Interview Logs
                  </label>
                  <textarea
                    id="modal-notes"
                    placeholder="Interview rounds, questions asked, follow-up dates..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isSubmitting}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none disabled:opacity-50"
                  ></textarea>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Saving...</span></>
                  ) : (
                    <span>Save Job</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
