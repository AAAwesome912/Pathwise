const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
// const visitorRoutes = require('./routes/visitor');
const ticketRoutes = require('./routes/ticketRoutes');
const bodyParser = require('body-parser');


// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
// app.use('/api/visitor', visitorRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


