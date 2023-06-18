import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import findSingleUser from "../../utils/findUser";

export async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const { email, password } = req.body || {};

  try {
    const user = await findSingleUser(email);

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (isValidPassword) {
        // if password is correct, generate cookie
        const userInfo = {
          name: user.name,
          email: user.email,
          id: user.id,
        };

        const jwtExpiry = parseInt(process.env.JWT_EXPIRY as string);
        const token = jwt.sign(userInfo, process.env.JWT_SECRET as string, {
          expiresIn: jwtExpiry,
        });

        // set cookie
         res.cookie(process.env.COOKIE_NAME as string, token, {
          // maxAge: jwtExpiry,
          expires: new Date(Date.now() + jwtExpiry),
          httpOnly: true,
          signed: true,
          sameSite: "none",
          secure: true,
        });

        res.status(200).json(userInfo);
      } else {
        res.status(401).json({ error: "Incorrect Username or password!" });
      }
    } else {
      res.status(401).json({ error: "Incorrect Username or password!" });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(process.env.COOKIE_NAME as string, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    signed: true,
  });
  res.status(200).json({ message: "logged out" });
}

