import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getSnoozedMails(req: Request, res: Response) {
  try {
    const mails = await prisma.mail.findMany({
      where: {
        createdAt: {
          lt: new Date().toISOString(),
        },
        OR: [
          {
            senderId: req.tokenData.id,
            sendMailProperty: {
              snoozedTime: {
                gt: new Date().toISOString(),
              },
              snooze: true,
            },
          },
          {
            receiverId: req.tokenData.id,
            receiveMailProperty: {
              snoozedTime: {
                gt: new Date().toISOString(),
              },
              snooze: true
              
            },
          },
        ],
      },
      orderBy: [
        {
          sendMailProperty: {
            snoozedTime: "desc",
          },
        },
        {
          receiveMailProperty: {
            snoozedTime: "desc",
          },
        },
      ],
    });

    if (mails) {
      res.json({ mails: mails });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
  