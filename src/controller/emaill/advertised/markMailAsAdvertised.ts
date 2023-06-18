import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function markMailAsAdvertised(req: Request, res: Response) {
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
      const advertisedMails = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          inbox: false,
          promotion: true,
          social: false,
        },
      });

      if (advertisedMails) {
        res.json({ message: "Email marked as Advertised!" });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const advertisedMails = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
         promotion: true,
          inbox: false,
          social: false,
        },
      });

      if (advertisedMails) {
        res.json({ message: "Email marked as Advertised!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
