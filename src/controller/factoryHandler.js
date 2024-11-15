const ApiFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

module.exports.deleteOne = (Model) =>
  catchAsync(async function (req, res, next) {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError('No document found with that ID', 404));
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

module.exports.createOne = (Model) =>
  catchAsync(async function (req, res) {
    const { body } = req;
    const doc = await Model.create(body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

module.exports.updateOne = (Model) =>
  catchAsync(async function (req, res) {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!doc) return next(new AppError('No document found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

module.exports.getAll = (Model, findArgs = () => [{}]) =>
  catchAsync(async function (req, res, next) {
    const features = new ApiFeatures(
      Model.find(...findArgs(req, res, next)),
      req.query
    )
      .filter()
      .paginate()
      .limitFields()
      .sort();

    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });

/**
 * @param {Model} Model The model to query
 * @param {Object} options
 * @param {Function} options.findOneArgs A function that returns an object to use as arguments for the findOne method
 * @param {{path:string,select?:string}[]} options.populateOpts An array of objects to use as query argument for the populate method
 */
module.exports.getOne = (
  Model,
  { findOneArgs = () => ({}), populateOpts = null } = {}
) =>
  catchAsync(async function (req, res) {
    const { id } = req.params;

    let query = Model.findOne({ _id: id, ...findOneArgs(req) });
    populateOpts?.forEach((opt) => (query = query.populate(opt)));

    const doc = await query;
    if (!doc) return next(new AppError('No document found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
