import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getUsersTrashMails(req: Request, res: Response) {
  try {
    const mails = await prisma.mail.findMany({
      where: {
        OR: [
          {
            receiverId: req.tokenData.id,
            receiveMailProperty: {
              deleted: false,
              trashBin: true,
              spam: false,
            },
          },
          {
            senderId: req.tokenData.id,
            sendMailProperty: {
              trashBin: true,
              deleted: false,
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
