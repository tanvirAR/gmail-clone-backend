import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getScheduledSentEmails(req: Request, res: Response) {
  try {
    const mails = await prisma.mail.findMany({
      where: {
        createdAt: {
          gt: new Date().toISOString(),
        },
        senderId: req.tokenData.id,
        sendMailProperty: {
          deleted: false,
          trashBin: false,
          spam: false,
          scheduleSend: true
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    if (mails) {
      res.json({ mails: mails });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
