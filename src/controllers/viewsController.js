const Tour = require('../models/toursModel');
const Booking = require('../models/bookingsModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      select: 'review rating',
    })
    .populate({
      path: 'guides',
      select: 'name role photo',
    });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getLoginForm = (_req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (_req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

exports.getAccount = (_req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
