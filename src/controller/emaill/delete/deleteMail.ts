import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function deleteMailPermanently(req: Request, res: Response) {
   const mailId: string = req.params.emailId;

  try {
    let senderId;
    await prisma.mail
      .findUnique({
        where: {
          id: mailId,
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      })
      .then((data) => (senderId = data?.senderId));

    if (senderId == req.tokenData.id) {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const spam = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          deleted: true,
        },
      });

      if (spam) {
        res.status(200).json({ message: "Email deleted permanently!" });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const spam = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          deleted: true,
        },
      });

      if (spam) {
        res.status(200).json({ message: "Email deleted permanently!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
