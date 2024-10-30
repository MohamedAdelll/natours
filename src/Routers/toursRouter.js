const express = require('express');
const tourController = require('../controller/toursController.js');
const authController = require('../controller/authController.js');

const router = express.Router();

router.use(authController.checkAuth);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.restrictTo('admin', 'leadGuide'),
    tourController.createNewTour
  );
router
  .route('/:id')
  .patch(
    authController.restrictTo('admin', 'leadGuide'),
    tourController.editTour
  )
  .get(tourController.getTour)
  .delete(
    authController.restrictTo('admin', 'leadGuide'),
    tourController.deleteTour
  );

module.exports = router;
