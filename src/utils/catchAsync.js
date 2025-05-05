/**
 * Wrapper function to catch async errors
 * @param {Function} fn - Async function to execute
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;