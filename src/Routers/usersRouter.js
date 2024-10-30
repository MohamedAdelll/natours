const { Router } = require('express');
const router = Router();
const usersController = require('../controller/usersController');
const authController = require('../controller/authController');

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.checkAuth);

router.route('/updatePassword').post(authController.updatePassword);
router.route('/me').get(usersController.getMe, usersController.getUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser);
router
  .route('/:id')
  .get(usersController.getUser)
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser);

module.exports = router;
