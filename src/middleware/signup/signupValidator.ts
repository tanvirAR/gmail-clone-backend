import { body, validationResult } from "express-validator";
import createError from "http-errors"
import { RequestHandler } from "express";

// intenal imports 
import prisma from "../../prismaclient/prismaClient";

export const addUserValidators = [
  body("firstName")
    .isLength({ min: 1 })
    .withMessage("First name is required!")
    .isAlpha("en-US")
    .trim()
    .withMessage("Only alphabet is allowed!"),
  body("lastName")
    .isLength({ min: 1 })
    .withMessage("Last name is required!")
    .isAlpha("en-US")
    .trim()
    .withMessage("Only alphabet is allowed!"),
  body("password").isLength({ min: 4 }).withMessage("Not a strong password!"),
  body("email")
    .isEmail()
    .withMessage("Invalid email addesss!")
    .trim()
    .custom(async (value: string) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: value,
          },
        });

        if (user) {
          throw createError("Email already exist!");
        }
      } catch (err: any) {
        err instanceof createError.HttpError;
        throw createError(err.message);
      }
    }),
];
// eslint-disable-next-line func-names
export const addUserValidationHandler: RequestHandler =  (req, res, next) => {
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

