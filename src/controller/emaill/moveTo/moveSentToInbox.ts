import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function moveSentMailToInbox(req: Request, res: Response) {
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
      const mail = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          snooze: true,
          inbox: true,
          snoozedTime: new Date().toISOString(),
        },
      });

      if (mail) {
        res.json({ message: "Email moved to Inbox!" });
      }
    } 
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
