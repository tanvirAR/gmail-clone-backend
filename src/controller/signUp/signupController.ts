import { createUser } from "../../utils/createUser";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { signUpUser } from "../../interface/User.interface";


export async function addUser(req: Request<{}, {}, signUpUser>, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;

    // encrypt user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // save user or send error
  try {
    await createUser({ firstName, lastName, email, hashedPassword });

    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: err,
    });
  }
}


