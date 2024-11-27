const Review = require('../models/reviewsModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

// This can be /tours/:tourId/reviews/ or /reviews/
exports.getAllReviews = factory.getAll(Review, getAllHelper);
exports.createReview = factory.createOne(Review);
// This can be /tours/:tourId/reviews/:id or /reviews/:id
exports.getReview = factory.getOne(Review, { findOneArgs: getReviewHelper });

exports.getAllUserReviews = factory.getAll(Review, getAllUserReviewsHelper);

// This can be /tours/:tourId/reviews/:id or /reviews/:id
exports.updateReview = catchAsync(async function (req, res, next) {
  const { id, tourId } = req.params;
  const { rating, review: incomingReview } = req.body;
  const filter = {};
  if (tourId) filter.tour = tourId;

  const review = await Review.findOne({ _id: id, ...filter });
  if (!review) return next(new AppError('No review found for this id', 404));

  // This checks if the user is the owner of the review or an admin
  if (review.user !== req.user.id && req.user.role !== 'admin')
    return next(new AppError('You are not allowed to edit this review', 403));

  const updatedReview = await Review.findByIdAndUpdate(
    id,
    {
      rating,
      review: incomingReview,
    },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedReview,
  });
});

module.exports.handleCreateReviewRequestBody = (req, _, next) => {
  req.body.user = req.user.id;
  if (req.params.tourId) req.body.tour = req.params.tourId;

  next();
};

function getReviewHelper(req) {
  const { id, tourId } = req.params;

  const filter = { _id: id };
  if (tourId) filter.tour = tourId;

  return filter;
}

function getAllUserReviewsHelper(req, _, next) {
  const { id, tourId } = req.params;
  const filter = { user: id };

  if (tourId) next(new AppError('Invalid route', 400));

  return filter;
}

function getAllHelper(req) {
  const { tourId } = req.params;

  const filter = {};
  if (tourId) filter.tour = tourId;

  return [filter];
}
