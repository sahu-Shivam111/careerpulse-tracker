const db = require('../config/db');

// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res) => {
  const { company, position, status, applied_date, notes } = req.body;
  const userId = req.user.id; // From authMiddleware

  // Basic validation
  if (!company || !position || !applied_date) {
    return res.status(400).json({ message: 'Company name, position, and applied date are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO jobs (user_id, company, position, status, applied_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, company, position, status || 'Applied', applied_date, notes || null]
    );

    return res.status(201).json({
      message: 'Job application added successfully.',
      job: {
        id: result.insertId,
        user_id: userId,
        company,
        position,
        status: status || 'Applied',
        applied_date,
        notes: notes || null
      }
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({ message: 'Server error while creating job application.' });
  }
};

// @desc    Get all job applications for user (with search and status filtering)
// @route   GET /api/jobs
// @access  Private
exports.getAllJobs = async (req, res) => {
  const userId = req.user.id;
  const { search, status } = req.query;

  try {
    let query = 'SELECT * FROM jobs WHERE user_id = ?';
    const queryParams = [userId];

    // Optional Search Filter: by company name
    if (search) {
      query += ' AND company LIKE ?';
      queryParams.push(`%${search}%`);
    }

    // Optional Status Filter: exact match
    if (status) {
      query += ' AND status = ?';
      queryParams.push(status);
    }

    // Order by newest first
    query += ' ORDER BY created_at DESC';

    const [jobs] = await db.query(query, queryParams);
    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({ message: 'Server error while fetching job applications.' });
  }
};

// @desc    Get a single job application details
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.id;

  try {
    const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [jobId, userId]);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job application not found.' });
    }

    return res.status(200).json(jobs[0]);
  } catch (error) {
    console.error('Get job by ID error:', error);
    return res.status(500).json({ message: 'Server error while fetching job application.' });
  }
};

// @desc    Update a job application
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.id;
  const { company, position, status, applied_date, notes } = req.body;

  // Basic validation
  if (!company || !position || !applied_date) {
    return res.status(400).json({ message: 'Company name, position, and applied date are required.' });
  }

  try {
    // Check if the job exists and belongs to the current user
    const [existingJobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [jobId, userId]);
    if (existingJobs.length === 0) {
      return res.status(404).json({ message: 'Job application not found or unauthorized.' });
    }

    // Perform update
    await db.query(
      'UPDATE jobs SET company = ?, position = ?, status = ?, applied_date = ?, notes = ? WHERE id = ? AND user_id = ?',
      [company, position, status, applied_date, notes || null, jobId, userId]
    );

    return res.status(200).json({
      message: 'Job application updated successfully.',
      job: {
        id: parseInt(jobId),
        user_id: userId,
        company,
        position,
        status,
        applied_date,
        notes: notes || null
      }
    });
  } catch (error) {
    console.error('Update job error:', error);
    return res.status(500).json({ message: 'Server error while updating job application.' });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if job exists and belongs to current user
    const [existingJobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND user_id = ?', [jobId, userId]);
    if (existingJobs.length === 0) {
      return res.status(404).json({ message: 'Job application not found or unauthorized.' });
    }

    // Delete job
    await db.query('DELETE FROM jobs WHERE id = ? AND user_id = ?', [jobId, userId]);
    return res.status(200).json({ message: 'Job application deleted successfully.' });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({ message: 'Server error while deleting job application.' });
  }
};

// @desc    Get job statistics for dashboard
// @route   GET /api/jobs/stats
// @access  Private
exports.getJobStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // Perform high-performance SQL aggregation in a single query
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END), 0) AS applied,
        COALESCE(SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END), 0) AS interview,
        COALESCE(SUM(CASE WHEN status = 'Offer' THEN 1 ELSE 0 END), 0) AS offer,
        COALESCE(SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END), 0) AS rejected
      FROM jobs 
      WHERE user_id = ?`,
      [userId]
    );

    // SQL returns array of rows, we grab the first element
    const rawStats = stats[0];

    // Send formatted statistics
    return res.status(200).json({
      total: rawStats.total,
      applied: parseInt(rawStats.applied),
      interview: parseInt(rawStats.interview),
      offer: parseInt(rawStats.offer),
      rejected: parseInt(rawStats.rejected)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ message: 'Server error while calculating job statistics.' });
  }
};
