const { Router } = require('express');
const router = Router();
const usersController = require('../controller/usersController');
const authController = require('../controller/authController');

router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router
  .route('/updatePassword')
  .post(authController.checkAuth, authController.updatePassword);
router.route('/resetPassword/:token').post(authController.resetPassword);
router.route('/signup').post(usersController.createNewUser);

router.route('/').get(usersController.getAllUsers);
router
  .route('/:id')
  .get(usersController.getUser)
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser);

module.exports = router;
