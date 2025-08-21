const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/ticketRoutes');
const servicesRouter = require('./routes/services');
const adminRoutes = require('./routes/admin');
const bodyParser = require('body-parser');

// This array now includes your hardcoded local origins
// We will dynamically add the devtunnels origin when a request comes in
const allowedOrigins = ['http://localhost:3000', 'http://192.168.101.18:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // If the request has no origin (e.g., from Postman or a same-origin request)
    // or if the origin is already in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // ✅ Check if the origin is a devtunnels URL and allow it for development
      if (origin.endsWith('.devtunnels.ms')) {
        callback(null, true);
      } else {
        // Reject all other origins
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/services', servicesRouter);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});