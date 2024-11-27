const express = require('express');
const tourController = require('../controllers/toursController.js');
const authController = require('../controllers/authController.js');
const reviewsRouter = require('./reviewsRouter.js');

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.checkAuth,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.checkAuth,
    authController.restrictTo('admin', 'leadGuide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createNewTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.checkAuth,
    authController.restrictTo('admin', 'leadGuide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.editTour
  )
  .delete(
    authController.checkAuth,
    authController.restrictTo('admin', 'leadGuide'),
    tourController.deleteTour
  );

module.exports = router;
