const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Make sure this is the same key used for signing

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header not found.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not found.' });
  }
  
  console.log("Received token:", token); // ✅ Add this line to see the token

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // ✅ This will show if the token expired or is invalid
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
