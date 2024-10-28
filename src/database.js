const mongoose = require('mongoose');

const URL = process.env.DATABASE_URL?.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
  .replace('<username>', process.env.DATABASE_USERNAME)
  .replace('<database_name>', process.env.DATABASE_NAME);

// console.log(configEnv.DATABASE_LOCAL);

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log('db connection successful'))
  .catch((error) => console.log('failed to connect to database ' + error));

module.exports = mongoose;
