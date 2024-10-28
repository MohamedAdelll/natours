const { default: mongoose } = require('mongoose');
const mangoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user!'],
  },
  tourID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review must belong to a tour!'],
  },
  rating: {
    type: Number,
    required: [true, 'A review must have a rating!'],
    min: [1, 'A review must have at least a rating of one!'],
    max: [5, 'A review must have at most a rating of five!'],
  },
  review: {
    type: String,
    required: [true, 'A review must have a text!'],
  },
  createdAt: { default: Date.now(), type: Date },
});

ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'userID', select: 'name' }).populate({
    path: 'tourID',
    select: 'name photo',
  });
  next();
});

exports.module = mongoose.model('Review', ReviewSchema);
