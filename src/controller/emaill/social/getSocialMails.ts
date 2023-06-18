import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getSocialMails(req: Request, res: Response) {
  try {
    const mails = await prisma.mail.findMany({
      where: {
        OR: [
          {
            receiverId: req.tokenData.id,
            receiveMailProperty: {
              deleted: false,
              trashBin: false,
              social: true,
            },
          },
          {
            senderId: req.tokenData.id,
            sendMailProperty: {
              deleted: false,
              trashBin: false,
              social: true,
            },
          },
        ],
      },
    });

    if (mails) {
      res.json({ mails: mails });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
