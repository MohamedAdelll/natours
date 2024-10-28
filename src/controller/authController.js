const User = require('../models/usersModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function createSendToken(res, user, statusCode) {
  const token = user.signJWT(user._id);

  const cookieOptions = {
    httpOnly: true,
    expires: process.env.JWT_COOKIE_EXPIREIN * 24 * 60 * 60 * 1000,
  };

  if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    data: user,
    token,
  });
}

exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter your email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePasswords(password)))
    return next(
      new AppError('Email or password are not correct. Please try again', 401)
    );

  createSendToken(res, user, 200);
});

exports.checkAuth = catchAsync(async function (req, _, next) {
  const authorization = req.get('authorization');
  const [authType, incomingToken] = authorization.split(' ');
  if (!authorization || authType != 'Bearer')
    return next(
      new AppError(
        'Invalid token! Please sign back in to access this route.',
        401
      )
    );

  const decoded = jwt.verify(incomingToken, process.env.JWT_SECRET);
  const { id } = decoded;
  const user = await User.findOne({ _id: id });
  if (!user)
    return next(
      new AppError('Invalid token for this user! try signing in again.', 401)
    );
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        'You changed your password recently! please log back in to gain access',
        400
      )
    );
  req.user = user;
  next();
});

exports.restrictTo = function (...allowedRoles) {
  return function (req, _, next) {
    const { role } = req.user;
    if (allowedRoles.includes(role)) return next();
    next(
      new AppError('You are not allowed to perform this type of action', 401)
    );
  };
};

exports.forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError('Invalid Email. No user found with this mail', 404)
    );
  const token = user.genRandomToken();

  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${token}`;

  console.log(url);
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  const { token } = req.params;
  const encryptedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    ResetTokenExpiresIn: { $gt: Date.now() },
  });
  if (!user)
    return next(new AppError('Invalid token or token has expired! Try again'));
  console.log(req.body);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.ResetTokenExpiresIn = undefined;
  await user.save();

  createSendToken(res, user, 200);
});

exports.updatePassword = catchAsync(async function (req, res, next) {
  const { password, newPassword, passwordConfirm } = req.body;
  const user = await User.findById(req.user.id, '+password');

  if (!(await user.comparePasswords(password)))
    return next(new AppError("Password provided doesn't match!"));

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(res, user, 200);
});
