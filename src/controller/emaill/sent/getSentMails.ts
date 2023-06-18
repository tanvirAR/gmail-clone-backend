import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getSentMails(req: Request, res: Response) {
  try {
    const createMail = await prisma.mail.findMany({
      where: {
        OR: [
          {
            senderId: req.tokenData.id,
            sendMailProperty: {
              deleted: false,
              trashBin: false,
              sent: true,
              spam: false,
              scheduleSend: false,
            },
          },
          {
            createdAt: {
              lt: new Date().toISOString(),
            },
            senderId: req.tokenData.id,
            sendMailProperty: {
              deleted: false,
              trashBin: false,
              sent: true,
              spam: false,
              scheduleSend: true,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (createMail) {
      res.json({ mails: createMail });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
