const bcrypt = require('bcrypt');
const password = 'Admin1'; // 👈 Change this to your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hashed Password:');
  console.log(hash);
});