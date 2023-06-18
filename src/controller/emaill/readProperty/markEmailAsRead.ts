import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function markMailAsRead(req: Request, res: Response) {
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
      // set email for receiver delete field to true instead of deleteing the actual mail
      const deleteMail = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          read: true,
        },
      });

      if (deleteMail) {
        res.json({ message: "Deleted Successfully!" });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const deleteMail = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          read: true,
        },
      });

      if (deleteMail) {
        res.json({ message: "Deleted Successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

export async function markMailAsUnRead(req: Request, res: Response) {
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
      // set email for receiver delete field to true instead of deleteing the actual mail
      const deleteMail = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          read: false,
        },
      });

      if (deleteMail) {
        res.status(200).json({ message: "Deleted Successfully!" });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const deleteMail = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          read: false,
        },
      });

      if (deleteMail) {
        res.status(200).json({ message: "Deleted Successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
