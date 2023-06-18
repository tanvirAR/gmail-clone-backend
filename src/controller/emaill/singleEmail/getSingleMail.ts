import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getSingleMail(req: Request, res: Response) {
  const mailId: string = req.params.emailId;
  try {
    const mail = await prisma.mail.findUnique({
      where: {
        id: mailId,
      },
    });

    if (mail) {
      res.json({ mail: mail });
    } else {
      res.status(404).json({"message": 'Email not found!'})
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
