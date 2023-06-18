import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function markMailAsSocial(req: Request, res: Response) {
  const mailId: string = req.body.mailId;

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
      const social = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          social: true,
          inbox: false
        },
      });

      if (social) {
        res.json({ message: "Email marked as social!" });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const social = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          social: true,
          inbox: false
        },
      });

      if (social) {
        res.json({ message: "Email marked as social!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
