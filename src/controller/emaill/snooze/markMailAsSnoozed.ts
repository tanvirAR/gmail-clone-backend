import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function markMailAsSnoozed(req: Request, res: Response) {
  const mailId: string = req.body.mailId;
  const time: string = req.body.time
  try {
    let senderId;
   const a = await prisma.mail
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
      // update snoozed time to filter it out during getting all user mails 
      const snoozedMail = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          snoozedTime: time,
          snooze: true,
          inbox: true
        },
      });

      if (snoozedMail) {
        res.json({ message: "Mails marked as snoozed!" });
      }
    } else {
      // update snoozed time to filter it out during getting all user mails
      const snoozedMail = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          snoozedTime: time,
          snooze: true,
          inbox: true,
        },
      });

      if (snoozedMail) {
        res.json({ message: "Mail marked as snoozed" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "error" });
  }
}
