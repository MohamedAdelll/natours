const express = require('express');
const tourController = require('../controller/toursController.js');
const authController = require('../controller/authController.js');

const router = express.Router();
router
  .route('/')
  .get(authController.checkAuth, tourController.getAllTours)
  .post(
    authController.checkAuth,
    authController.restrictTo('admin', 'leadGuide'),
    tourController.createNewTour
  );
router
  .route('/:id')
  .patch(
    authController.checkAuth,
    authController.restrictTo('admin', 'leadGuide'),
    tourController.editTour
  )
  .get(authController.checkAuth, tourController.getTour)
  .delete(
    authController.checkAuth,
    authController.restrictTo('admin', 'leadGuide'),
    tourController.deleteTour
  );

module.exports = router;
