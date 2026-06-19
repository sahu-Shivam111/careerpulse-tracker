const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming requests with JSON payloads

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Basic Root Route for testing server status
app.get('/', (req, res) => {
  res.json({ message: "Job Application Tracker API is running." });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Verify Database Connection Pool and Start Server
async function startServer() {
  try {
    // Perform a simple query to verify database connection
    await db.query('SELECT 1');
    console.log('✔ Connected to MySQL Database Pool successfully.');

    app.listen(PORT, () => {
      console.log(`✔ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✘ Database connection failed:', error.message);
    process.exit(1); // Exit process with failure code
  }
}

startServer();
