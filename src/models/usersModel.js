const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    // required: [true, `A user must have a name`],
    minLength: [3, `A name must be more than 3 characters`],
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: [true, `A user must have a password`],
    minLength: [8, `A password must be more than 8 characters`],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password`],
    validate: {
      validator: function (passConfirm) {
        return this.password === passConfirm;
      },
      message: "Passwords don't match!",
    },
    trim: true,
    select: false,
  },
  email: {
    type: String,
    required: [true, `A user must have an email`],
    trim: true,
    unique: [true, 'Email must be unique'],
    lowercase: true,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'leadGuide', 'admin'],
      message: `User roles must be either of 'user', 'guide', 'leadGuide' or 'admin'`,
    },
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Number,
  passwordResetToken: String,
  ResetTokenExpiresIn: Date,
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const encryptedPass = await bcrypt.hash(
      this.password + process.env.PASSWORD_SALT,
      12
    );
    this.password = encryptedPass;
    this.passwordConfirm = undefined;
  }

  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(
    password + process.env.PASSWORD_SALT,
    this.password
  );
};

userSchema.methods.changedPasswordAfter = function (iat) {
  if (this.passwordChangedAt) {
    const passwordChangedTime = this.passwordChangedAt / 1000;
    return iat < passwordChangedTime;
  }
  return false;
};

userSchema.methods.signJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

userSchema.methods.genRandomToken = function () {
  const randomToken = crypto.randomBytes(32).toString('hex');
  const encryptedToken = crypto
    .createHash('sha256')
    .update(randomToken)
    .digest('hex');
  this.passwordResetToken = encryptedToken;
  this.ResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  this.save({ validateBeforeSave: false });
  return randomToken;
};

module.exports = mongoose.model('User', userSchema);
