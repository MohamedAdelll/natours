const Tour = require('../models/toursModel');
const ApiFeatures = require('../utils/ApiFeatures.js');
const catchAsync = require('../utils/CatchAsync');

exports.getAllTours = catchAsync(async function (req, res) {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .paginate()
    .limitFields()
    .sort();
  const tours = await features.query;
  res.json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

exports.editTour = catchAsync(async function (req, res) {
  const { body } = req;
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.createNewTour = catchAsync(async function (req, res) {
  const { body } = req;
  const tour = await Tour.create(body);
  res.status(201).json({
    status: 'success',
    data: tour,
  });
});

exports.getTour = catchAsync(async function (req, res) {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.deleteTour = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
