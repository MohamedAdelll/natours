const multer = require('multer');
const User = require('../models/usersModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (_, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, _res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
        "You can't change your password here. Please go to /forgotpassword in order to change it",
        401
      )
    );
  const filteredObj = filterObject(req.body, 'name', 'email', 'photo');
  if (req.file.filename) filteredObj.photo = req.file.filename;

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
