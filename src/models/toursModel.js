const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const opts = { toJSON: { virtuals: true } };

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      unique: true,
      minlength: [10, 'A tour must have at least 10 characters'],
      maxlength: [40, 'A tour must have at most 40 characters'],
    },
    slug: String,
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: { type: Number, default: 25 },
    difficulty: {
      type: String,
      default: 'medium',
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: `Difficulty must be 'easy, 'medium' or 'difficult'`,
      },
      trim: true,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a cover image'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    secretTour: { type: Boolean, default: false, select: false },
    images: [String],
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  opts
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: false }, { __v: 0 });
  next();
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
