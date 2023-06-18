import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";

export async function getAdditionalSingleMailProperty(
  req: Request,
  res: Response
) {
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
      const mail = await prisma.sendMailProperty.findUnique({
        where: {
          mailId: mailId,
        },
      });

      if (mail) {
        res.json({ mail: mail });
      }
    } else {
      const mail = await prisma.receivedMailProperty.findUnique({
        where: {
          mailId: mailId,
        },
      });

      if (mail) {
        res.json({ mail: mail });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
