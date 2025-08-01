require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

db.query('SELECT DATABASE() AS db', (err, result) => {
  if (err) {
    console.error('❌ Error checking active DB:', err.message);
  } else {
    console.log('✅ Connected to database:', result[0].db);
  }
});

// ✅ EXPORT the db connection
module.exports = db;
