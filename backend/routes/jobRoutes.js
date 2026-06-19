const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all job-related routes
router.use(protect);

// Route for creating a new job application
// Endpoint: POST /api/jobs
router.post('/', jobController.createJob);

// Route for fetching all job applications (with optional search and status filtering)
// Endpoint: GET /api/jobs
router.get('/', jobController.getAllJobs);

// Route for fetching job metrics (Total, Applied, Interview, Offer, Rejected)
// Endpoint: GET /api/jobs/stats
// NOTE: This MUST be placed BEFORE GET /api/jobs/:id to avoid collisions
router.get('/stats', jobController.getJobStats);

// Route for fetching a specific job application
// Endpoint: GET /api/jobs/:id
router.get('/:id', jobController.getJobById);

// Route for updating a job application
// Endpoint: PUT /api/jobs/:id
router.put('/:id', jobController.updateJob);

// Route for deleting a job application
// Endpoint: DELETE /api/jobs/:id
router.delete('/:id', jobController.deleteJob);

module.exports = router;
