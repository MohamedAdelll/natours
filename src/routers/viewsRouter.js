const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/my-tours', authController.checkAuth, viewsController.getMyTours);
router.get('/me', authController.checkAuth, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.checkAuth,
  viewsController.updateUserData
);

module.exports = router;
