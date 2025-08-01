const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/ticketRoutes');
const bodyParser = require('body-parser');

const allowedOrigins = ['http://localhost:3000', 'http://192.168.101.18:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

