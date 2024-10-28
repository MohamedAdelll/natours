const express = require('express');
const app = express();
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./Routers/toursRouter');
const usersRouter = require('./Routers/usersRouter');
const reviewsRouter = require('./Routers/reviewsRouter');

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.use('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
