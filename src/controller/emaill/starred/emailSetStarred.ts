import { Request, Response, NextFunction, RequestHandler } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function markMailAsStarred(req: Request, res: Response) {
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
  

      const update = await prisma.$queryRaw`
        UPDATE sendMailProperty 
        SET starred = TRUE
        WHERE mailId = ${mailId}
    `;

      if (update) {
        res.json({ message: "Marked as starred Successfully!" });
      }
    } else {


      const update = await prisma.$queryRaw`
        UPDATE receivedMailProperty 
        SET starred = TRUE
        WHERE mailId = ${mailId}
    `;

      if (update) {
        res.json({ message: "Marked as starred Successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}


export async function markMailAsUnStarred(req: Request, res: Response) {
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
      const update = await prisma.$queryRaw`
        UPDATE sendMailProperty 
        SET starred = FALSE
        WHERE mailId = ${mailId}
    `;

      if (update) {
        res.json({ message: "Marked as Unstarred Successfully!" });
      }
    } else {
      const update = await prisma.$queryRaw`
        UPDATE receivedMailProperty 
        SET starred = FALSE
        WHERE mailId = ${mailId}
    `;

      if (update) {
        res.json({ message: "Marked as Unstarred Successfully!" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
