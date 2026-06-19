const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and authorize requests
const protect = (req, res, next) => {
  let token;

  // Check if token is present in authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Extract the token part from "Bearer <token>"
      token = authHeader.split(' ')[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user payload (contains user id) to the request object
      req.user = decoded;

      // Pass control to the next middleware/controller
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  // If no token was found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };
