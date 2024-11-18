const AppError = require('../utils/AppError');
const lodash = require('lodash');

module.exports = async function globalErrorHandler(err, req, res, _) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV.trim() === 'development')
    sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV.trim() === 'production') {
    if (err.name === 'CastError') err = handleCastErrorProd(err);
    if (err.name === 'ValidationError') err = handleValidationErrorProd(err);
    if (err.codeName === 'DuplicateKey') err = handleDuplicateKeyErrorProd(err);
    sendErrorProd(err, req, res);
  }
};

function sendErrorDev(err, req, res) {
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });

  res.status(err.statusCode).render('error', { msg: err.message });
}

function sendErrorProd(error, req, res) {
  if (error.isOperational) {
    if (req.originalUrl.startsWith('/api'))
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    res.status(error.statusCode).render('error', { msg: error.message });
  } else {
    console.error(`Error🧨 ${error}`);
    if (req.originalUrl.startsWith('/api'))
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong! Try again in a while',
      });
    res.status(500).render('error', {
      message: 'Something went wrong! Try again in a while',
    });
  }
}

function handleCastErrorProd(err) {
  return new AppError(
    `Invalid input of ${err.value} for ${err.path} field`,
    400
  );
}

function handleValidationErrorProd(err) {
  return new AppError(`${err.message}`, 400);
}

function handleDuplicateKeyErrorProd(err) {
  const duplicateKeys = Object.keys(err.keyValue).join(', ');
  return new AppError(
    `Duplicate data entry. Please change value${
      Object.keys(err.keyValue).join.length > 1 ? 's' : ''
    } of ${duplicateKeys}`,
    400
  );
}
