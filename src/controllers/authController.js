const User = require('../models/usersModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');
const { promisify } = require('../utils');

function createSendToken(res, user, statusCode) {
  const token = user.signJWT();

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000
    ),
  };

  if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;

  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    data: user,
    token,
  });
}

exports.signup = catchAsync(async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({ name, email, password, confirmPassword });
  await new Email(user, `${req.protocol}://${req.get('host')}/`).sendWelcome();
  createSendToken(res, user, 201);
});

exports.logout = function (_, res) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

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

exports.isLoggedIn = (req, res, next) => {
  this.checkAuth(req, res, next, { throws: false });
};

exports.checkAuth = catchAsync(async function (
  req,
  res,
  next,
  { throws } = { throws: true }
) {
  const token =
    (req.get('authorization')?.split(' ')?.at(-1) || req.cookies.jwt) ?? '';

  if (!token)
    return throws
      ? next(
          new AppError(
            'Invalid token! Please sign back in to access this page.',
            401
          )
        )
      : next();

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded)
    return throws
      ? next(
          new AppError(
            'Invalid token for this user! try signing in again.',
            401
          )
        )
      : next();
  const { id, iat } = decoded;
  const user = await User.findOne({ _id: id });
  if (!user)
    return throws
      ? next(
          new AppError(
            'Invalid token for this user! try signing in again.',
            401
          )
        )
      : next();
  if (user.changedPasswordAfter(iat))
    return throws
      ? next(
          new AppError(
            'You changed your password recently! please log back in to gain access',
            400
          )
        )
      : next();
  req.user = user;
  res.locals.user = user;
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

  //prettier-ignore
  const url = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword?token=${token}`;

  try {
    const email = new Email(
      {
        email: user.email,
        name: user.name,
      },
      url
    );
    await email.sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.ResetTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'An error occurred while sending the email. Please try again later',
        500
      )
    );
  }
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
    return next(
      new AppError('Invalid token or token has expired! Try again', 400)
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.ResetTokenExpiresIn = undefined;
  await user.save();

  createSendToken(res, user, 200);
});

exports.updatePassword = catchAsync(async function (req, res, next) {
  const { passwordCurrent, newPassword, passwordConfirm } = req.body;
  const user = await User.findById(req.user.id, '+password');

  if (!(await user.comparePasswords(passwordCurrent)))
    return next(new AppError("Password provided doesn't match!", 400));

  if (newPassword !== passwordConfirm)
    return next(new AppError('Passwords do not match', 400));
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(res, user, 200);
});
