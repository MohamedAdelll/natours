const Review = require('../models/reviewsModel');
const User = require('../models/usersModel');
const Tour = require('../models/toursModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');

exports.getAllReviews = catchAsync(async function (_, res) {
  const reviews = await Review.find();
  res.json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

exports.getAllUserReviews = catchAsync(async function (req, res) {
  const { userID } = req.params;
  const reviews = await Review.find({ userID });
  res.json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

exports.getAllTourReviews = catchAsync(async function (req, res) {
  const { tourID } = req.params;
  const reviews = await Review.find({ tourID });
  res.json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});

exports.createReview = catchAsync(async function (req, res) {
  const reviews = await Review.create(req.body);
  res.json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});
