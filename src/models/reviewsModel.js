const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user!'],
  },
  tour: {
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
  createdAt: { default: Date.now, type: Date },
});

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
