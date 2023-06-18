import { RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import createError from "http-errors";

// internal imports
import prisma from "../../prismaclient/prismaClient";

export const sendMailValidator = [
  body("email")
    .exists()
    .withMessage("Receiver email address is required!")
    .isEmail()
    .withMessage("Invalid email addesss!")
    .trim()
    .custom(async (value) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: value,
          },
        });

        if (!user) {
          throw createError("User does not exist!");
        }
      } catch (err: any) {
        throw createError(err.message);
      }
    }),
];
export const sendMailValidationHandler: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    res.status(403).json({
      mappedErrors,
    });
  }
};
