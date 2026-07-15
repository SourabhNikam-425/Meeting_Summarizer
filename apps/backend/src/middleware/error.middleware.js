
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

export function errorMiddleware(
err,
_req,
res,
_next)
{
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Mongoose duplicate key
  if (err.code === '11000') {
    res.status(409).json({ success: false, message: 'Duplicate entry' });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ success: false, message: 'Internal server error' });
}