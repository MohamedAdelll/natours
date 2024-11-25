const express = require('express');
const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/my-tours', authController.isLoggedIn, viewsController.getMyTours);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.checkAuth, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.checkAuth,
  viewsController.updateUserData
);

module.exports = router;
