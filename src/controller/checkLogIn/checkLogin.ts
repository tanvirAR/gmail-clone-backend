import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "@prisma/client";

// internal imports
import jwt from "jsonwebtoken";
import findSingleUser from "../../utils/findUser";

// add extra data to the request object
export interface CustomCheckLoginRequest extends Request {
  tokenData: {
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export const checkLoggedIn = async (
  req: CustomCheckLoginRequest,
  res: Response,
) => {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME as string];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as User;

      const user = await findSingleUser(decoded.email);
      if (user) {
          const userInfo = {
            name: user.name,
            email: user.email,
            id: user.id,
          };

       res.status(200).json({"user": userInfo})
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "Authentication Error!",
            },
          },
        });
      }
    } catch (err) {
      res.status(401).json({
        errors: {
          common: {
            msg: "Authentication Error!",
          },
        },
      });
    }
  } else {
    res.status(401).json({
      error: "Authetication Error!",
    });
  }
};
