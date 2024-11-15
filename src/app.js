const express = require('express');
const app = express();
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routers/toursRouter');
const usersRouter = require('./routers/usersRouter');
const viewsRouter = require('./routers/viewsRouter');
const reviewsRouter = require('./routers/reviewsRouter');

app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/', viewsRouter);

app.use('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
