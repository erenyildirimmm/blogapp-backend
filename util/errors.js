const errorHandling = (error, req, res, next) => {
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  next(error);
};

export default errorHandling;
