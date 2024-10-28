const AppError = require('../utils/AppError');
const lodash = require('lodash');

module.exports = async function globalErrorHandler(err, _, res, _) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV.trim() === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV.trim() === 'production') {
    if (err.name === 'CastError') err = handleCastErrorProd(err);
    if (err.name === 'ValidationError') err = handleValidationErrorProd(err);
    if (err.codeName === 'DuplicateKey') err = handleDuplicateKeyErrorProd(err);
    sendErrorProd(err, res);
  }
};

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
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

function sendErrorProd(error, res) {
  if (error.isOperational)
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  else {
    console.error(`Error🧨 ${error}`);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong! Try again in a while',
    });
  }
}
