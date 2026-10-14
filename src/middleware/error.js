import ApiError from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  // If a response is already being sent, let Express handle it
  if (res.headersSent) return next(err);

  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = err.details;

  // ----- Errors thrown by libraries -----
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON in request body';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue || {})[0] || 'value'} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired, please log in again';
  }

  const isServerError = status >= 500;
  if (isServerError) console.error(err);

  // Never leak internal details of unexpected errors in production
  if (isServerError && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isServerError && process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};