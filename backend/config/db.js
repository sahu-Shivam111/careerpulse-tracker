const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Max number of concurrent connections
  queueLimit: 0        // Unlimited queueing of requests
});

// Use the promise-based wrapper for clean async/await syntax
const db = pool.promise();

module.exports = db;
