import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function moveTrashToInbox(req: Request, res: Response) {
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
      const spam = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          trashBin: false,
          snooze: true,
          inbox: true,
          snoozedTime: new Date().toISOString(),
        },
      });

      if (spam) {
        res.json({ message: "Email moved to Inbox!" });
      }
    } else {
      const spam = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          trashBin: false,
          
        },
      });

      if (spam) {
        res.json({ message: "Email moved to Inbox!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

