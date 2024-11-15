const { Router } = require('express');
const reviewController = require('../controller/reviewsController.js');
const { restrictTo, checkAuth } = require('../controller/authController.js');

const router = Router({ mergeParams: true });

router.use(checkAuth);

// This can be /tours/:tourId/reviews/:id or /reviews/:id
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(restrictTo('user', 'admin'), reviewController.updateReview);

// This can be /tours/:tourId/reviews or /reviews
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('user'),
    reviewController.handleCreateReviewRequestBody,
    reviewController.createReview
  );

router
  .route('/user/:id')
  .get(restrictTo('admin'), reviewController.getAllUserReviews);

module.exports = router;
