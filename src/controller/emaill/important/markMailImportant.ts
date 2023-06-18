import { Request, Response, NextFunction, RequestHandler } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function markMailAsImportant(req: Request, res: Response) {
  const mailId: string = req.params.emailId;

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
      const update = await prisma.$queryRaw`
        UPDATE sendMailProperty 
        SET important = TRUE
        WHERE mailId = ${mailId}
    `;
      if (update) {
        res.json({ message: "Marked as Important Successfully!" });
      }
    } else {
      const update = await prisma.$queryRaw`
        UPDATE receivedMailProperty 
        SET important =TRUE
        WHERE mailId = ${mailId}
    `;
      if (update) {
        res.json({ message: "Marked as Important Successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}


export async function markMailAsUnImportant(req: Request, res: Response) {
  const mailId: string = req.params.emailId;

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
      const update = await prisma.$queryRaw`
        UPDATE sendMailProperty 
        SET important = FALSE
        WHERE mailId = ${mailId}
    `;
      if (update) {
        res.json({ message: "Marked as UnImportant Successfully!" });
      }
    } else {
      const update = await prisma.$queryRaw`
        UPDATE receivedMailProperty 
        SET important = FALSE
        WHERE mailId = ${mailId}
    `;
      if (update) {
        res.json({ message: "Marked as UnImportant Successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
