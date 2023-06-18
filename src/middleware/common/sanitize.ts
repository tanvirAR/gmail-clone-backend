import validator from "validator";
import { NextFunction, Request, Response } from "express";



// Sanitization middleware
const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = validator.escape(req.body[key]);
    }
  }

  // Sanitize request query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = validator.escape(req.query[key] as string);
      }
    }
  }

  next();
};

export default sanitizationMiddleware;