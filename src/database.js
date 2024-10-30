const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('db connection successful'))
  .catch((error) => console.log('failed to connect to database', error));

module.exports = mongoose;
