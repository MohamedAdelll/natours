const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routers/toursRouter');
const usersRouter = require('./routers/usersRouter');
const viewsRouter = require('./routers/viewsRouter');
const reviewsRouter = require('./routers/reviewsRouter');
const path = require('path');

app.use(express.json());
app.use(cookieParser());

const static = path.join(__dirname, '..', 'public');

app.use(express.static(static));
const views = path.join(__dirname, 'views');
app.set('views', views);
app.set('view engine', 'pug');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/', viewsRouter);

app.use('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
