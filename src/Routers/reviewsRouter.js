const { Router } = require('express');
const reviewController = require('../controller/reviewsController.js');

const router = Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);
router.route('/userID').get(reviewController.getAllUserReviews);

router.route('/tourID').get(reviewController.getAllTourReviews);

module.exports = router;
