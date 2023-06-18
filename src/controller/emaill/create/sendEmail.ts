import { Request, Response, NextFunction } from "express";

// internal imports
import findSingleUser from "../../../utils/findUser";
import { sendMailInterface } from "../../../interface/sendMailRequest.interface";
import { createMail } from "../../../utils/createMail";
import { io } from "../../../app";

export async function sendMail(
  req: Request<{}, {}, sendMailInterface>,
  res: Response,
  next: NextFunction
) {
  const { attachment, message, subject } = req.body;
  if (!message && !attachment && !subject) {
    res.json({
      message:
        "Minimum one field is required from message, subject or attachment",
    });
    return;
  }

  try {
    const receiver = await findSingleUser(req.body.email);
    if (receiver !== null) {
      const newMail = await createMail(req, receiver);

      if (newMail) {

        /* emit a socket event after succesffully creating an email  */
        io.emit("newEmail", {
          data: newMail,
        });
        
        res.json({ message: "Email sent Successfully", mail: newMail });
      }
    }
  } catch (error) {
    res.json({ message: error });
  }
}
