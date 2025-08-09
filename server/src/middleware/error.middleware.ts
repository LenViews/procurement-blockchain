import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  res.status(500).json({
    message: 'Something went wrong on the server'
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
};