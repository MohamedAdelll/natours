const User = require('../models/usersModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

exports.getMe = function (req, _, next) {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User, () => [{}, '+password']);
exports.getUser = factory.getOne(User);

exports.createNewUser = catchAsync(async function (req, res) {
  const { name, password, passwordConfirm, email, image, role } = req.body;
  const user = await User.create({
    name,
    password,
    passwordConfirm,
    email,
    image,
    role,
  });
  user.password = undefined;
  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.updateUser = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        "You can't change your password here. Please go to /forgotpassword in order to change it"
      )
    );
  const filteredObj = filterObject(req.body, 'name', 'email', 'image');
  const user = await User.findByIdAndUpdate(id, filteredObj, {
    runValidators: true,
    new: true,
  });

  if (!user) return next(new AppError('No user found for this id', 400));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUser = catchAsync(async function (req, res) {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

function filterObject(bodyObj, ...filterArr) {
  const incomingKeysArr = Object.keys(bodyObj);
  const filteredObj = {};
  filterArr.forEach((wantedKey) => {
    if (incomingKeysArr.includes(wantedKey))
      filteredObj[wantedKey] = bodyObj[wantedKey];
  });
  return filteredObj;
}
