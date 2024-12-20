const { Router } = require('express');
const router = Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.route('/logout').get(authController.logout);
router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.checkAuth);

router.route('/updatePassword').patch(authController.updatePassword);

router
  .route('/me')
  .get(usersController.getMe, usersController.getUser)
  .patch(
    usersController.getMe,
    usersController.uploadUserPhoto,
    usersController.resizeUserPhoto,
    usersController.updateUser
  )
  .delete(usersController.getMe, usersController.deleteUser);

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
