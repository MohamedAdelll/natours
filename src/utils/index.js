module.exports.promisify = (fn) => {
  return (...args) =>
    new Promise((resolve, reject) => {
      const result = fn(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
};
