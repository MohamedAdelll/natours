const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routers/toursRouter');
const usersRouter = require('./routers/usersRouter');
const viewsRouter = require('./routers/viewsRouter');
const reviewsRouter = require('./routers/reviewsRouter');
const bookingsRouter = require('./routers/bookingsRouter');
const bookingsController = require('./controllers/bookingsController');

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.post(
  '/checkout-webhook',
  express.raw({ type: 'application/json' }),
  bookingsController.webhookCheckout
);

app.use(cors({ credentials: true, origin: true }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

const static = path.join(__dirname, '..', 'public');
app.use(express.static(static));

const views = path.join(__dirname, 'views');
app.set('trust proxy');
app.set('views', views);
app.set('view engine', 'pug');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingsRouter);
app.use('/', viewsRouter);

app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
