module.exports = function catchAsync(fn) {
  return async (req, res, next, ...args) => {
    await fn(req, res, next, ...args).catch(next);
  };
};
