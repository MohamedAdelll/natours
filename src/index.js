const dotenv = require('dotenv');
dotenv.config();

const _db = require('./database');
const app = require('./app');

const port = process.env.PORT || 5555;

const server = app.listen(port, () => {
  console.log(`working on http://localhost:5555`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION🎆🧨 Shutting down...');
  console.log(err.name, err.message, err.stack);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION🎆🧨 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
