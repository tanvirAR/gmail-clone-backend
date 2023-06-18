import { Request, Response, NextFunction, RequestHandler } from "express";

// internal imports
import prisma from "../../../prismaclient/prismaClient";
import { sendMailInterface, sentScheduledMailInterface } from "../../../interface/sendMailRequest.interface";
import findSingleUser from "../../../utils/findUser";


export default async function sendScheduledMail(
  req: Request<{}, {}, sendMailInterface>,
  res: Response,
  next: NextFunction
) {
 const { attachment, message, subject, time } = req.body;
 if (!message && !attachment && !subject) {
   res.json({
     message:
       "Minimum one field is required from message, subject or attachment",
   });
   return;
 }
   try {

     const receiver = await findSingleUser(req.body.email);
     if (receiver !== null) {


       const newMail = await prisma.mail.create({
         data: {
           senderId: req.tokenData.id,
           senderEmail: req.tokenData.email, // added senderEmail property
           senderName: `${req.tokenData.firstName} ${req.tokenData.lastName}`, // added senderName property
           receiverId: receiver.id,
           message: message,
           subject: subject,
           attachment: attachment,
           createdAt: time,
           sendMailProperty: {
             create: {
               scheduleSend: true,
             },
           },
           receiveMailProperty: {
             create: {
             },
           },
         },
       });


       if (newMail) {
         res.json({ message: "Email sent Successfully", mail: newMail });
       }
     }
   } catch (error) {
     res.json({ message: error });
   }
}



