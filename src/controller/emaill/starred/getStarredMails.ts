import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getStarredMails(req: Request, res: Response) {
  try {
    const mails = await prisma.mail.findMany({
      where: {
        OR: [
          {
            receiverId: req.tokenData.id,
            receiveMailProperty: {
              deleted: false,
              trashBin: false,
              starred: true,
              spam: false,
            },
          },
          {
            senderId: req.tokenData.id,
            sendMailProperty: {
              trashBin: false,
              deleted: false,
              starred: true,
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
      res.json({ mails: mails });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
