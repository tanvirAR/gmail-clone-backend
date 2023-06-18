import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function cancellSnoozeMail(req: Request, res: Response) {
  const mailId: string = req.body.mailId;
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
          snoozedTime: new Date().toISOString(),
          snooze: false,
        },
      });

      if (snoozedMail) {
        res.status(200).json({ message: "Email snoozed cancelled successfully!" });
      }
    } else {
      // update snoozed time to filter it out during getting all user mails
      const snoozedMail = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          snoozedTime: new Date().toISOString(),
          snooze: false,
        },
      });

      if (snoozedMail) {
       res
         .status(200)
         .json({ message: "Email snoozed cancelled successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "error" });
  }
}
