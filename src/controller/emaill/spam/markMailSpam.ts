import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";
import veryEmailTypeForSendProperty from "../../../utils/verifyEmailTypeSendMail";
import veryEmailTypeForReceivedProperty from "../../../utils/verifyEmailTypeRecievedMail";

export async function markMailAsSpam(req: Request, res: Response) {
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
      const spam = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          spam: true,
          trashBin: false,
        },
      });

      if (spam) {
        const emailTypes = await veryEmailTypeForSendProperty(spam);
        res.json({ message: "Email Mark As Spam!", type: emailTypes });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const spam = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          spam: true,
          trashBin: false,
        },
      });

      if (spam) {
        const emailTypes = await veryEmailTypeForReceivedProperty(spam);
        res.json({ message: "Email Mark As Spam!", type: emailTypes });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

export async function markMailAsUnSpam(req: Request, res: Response) {
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
      const spam = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          spam: false,
          trashBin: false,
        },
      });

      if (spam) {
        const emailTypes = await veryEmailTypeForSendProperty(spam);
        res.json({ message: "Emailremoverd from Spam!", type: emailTypes });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const spam = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          spam: false,
          trashBin: false,
        },
      });

      if (spam) {
        const emailTypes = await veryEmailTypeForReceivedProperty(spam);
        res.json({ message: "Email removed from Spam!", type: emailTypes });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
