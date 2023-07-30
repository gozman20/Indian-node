//pageNotFound
const pageNotFound = (err, req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({ message: err.message });
};
module.exports = { pageNotFound, errorHandler };
