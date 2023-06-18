import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getUserEmails(req: Request, res: Response) {
  try {
    const mails = await prisma.mail.findMany({
      where: {
        createdAt: {
          lt: new Date().toISOString(),
        },
        OR: [
          {
            receiverId: req.tokenData.id,
            receiveMailProperty: {
              deleted: false,
              inbox: true,
              trashBin: false,
              spam: false,
              snoozedTime: {
                lt: new Date().toISOString(),
              },
            },
          },
          {
            senderId: req.tokenData.id,
            sendMailProperty: {
              snoozedTime: {
                lt: new Date().toISOString(),
              },
              snooze: true,
              inbox: true,
              deleted: false,
              trashBin: false,
              spam: false,
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
      res.json({ mails: mails, userId: req.tokenData.id });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
