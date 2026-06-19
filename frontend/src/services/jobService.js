import api from './api';

// Fetch all jobs with optional search and status parameters
const getAllJobs = async (search = '', status = '') => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;

  const response = await api.get('/jobs', { params });
  return response.data;
};

// Fetch a single job details by ID
const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

// Create a new job application entry
const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// Update an existing job application entry
const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete a job application entry
const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

// Fetch aggregated job counts for the dashboard
const getJobStats = async () => {
  const response = await api.get('/jobs/stats');
  return response.data;
};

const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
};

export default jobService;
