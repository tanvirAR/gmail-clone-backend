import { Request, Response, NextFunction } from "express";
import createError from "http-errors";


// default error handler
export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const statusCode =
    error instanceof createError.HttpError ? error.statusCode : 500;
  response.status(statusCode);
  response.json({ message: error.message });
}

// 404 not found handler
export function notFoundHandler(
  request: Request,
  response: Response,
  next: NextFunction
) {
  next(createError(404, "Your requested content was not found!"));
}

