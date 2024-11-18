module.exports.promisify = (fn) => {
  return (...args) =>
    new Promise((resolve) => {
      fn(...args, (err, data) => {
        if (err) return resolve(null);
        resolve(data);
      });
    });
};
