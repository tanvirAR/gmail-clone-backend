import { User } from "@prisma/client";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { sendMailInterface } from "../interface/sendMailRequest.interface";

// internal imports
import prisma from "../prismaclient/prismaClient";

export async function createMail(
  req: Request<{}, {}, sendMailInterface>,
  receiver: User
) {
  const { attachment, message, subject } = req.body;

  const createMail = await prisma.mail.create({
    data: {
      senderId: req.tokenData.id,
      senderEmail: req.tokenData.email, // added senderEmail property
      senderName: `${req.tokenData.firstName} ${req.tokenData.lastName}`, // added senderName property
      receiverId: receiver.id,
      message: message,
      subject: subject,
      attachment: attachment,
      sendMailProperty: {
        create: {},
      },
      receiveMailProperty: {
        create: {},
      },
    },
  });

  return createMail;
}
