import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";
import { sendMailProperty } from "@prisma/client";
import verifyEmailTypeReceivedProperty from "../../../utils/verifyEmailTypeRecievedMail";
import verifyEmailTypeSendProperty from "../../../utils/verifyEmailTypeSendMail";

export async function markMailAsTrash(req: Request, res: Response) {
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
      const deleteMail = await prisma.sendMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          trashBin: true,
          spam: false,
        },
      });

      if (deleteMail) {
         const emailTypes = await verifyEmailTypeSendProperty(deleteMail); 
        res.json({ message: "Deleted Successfully!", type: emailTypes });
      }
    } else {
      // set email for receiver delete field to true instead of deleteing the actual mail
      const deleteMail = await prisma.receivedMailProperty.update({
        where: {
          mailId: mailId,
        },
        data: {
          trashBin: true,
          spam: false
        },
      });

      if (deleteMail) {
        const emailTypes = await verifyEmailTypeReceivedProperty(deleteMail); 
        res.json({ message: "Deleted Successfully!", type: emailTypes });
      }
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
