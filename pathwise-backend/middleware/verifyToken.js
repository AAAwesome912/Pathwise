const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key'; // Make sure this matches the one you use to sign JWTs

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Expecting format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user data from token to the request
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
