import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";


 // cancell a scheduled mail by marking it as completly deleted for both end

export async function cancellScheudledMailFromSending(req: Request, res: Response) {
  const mailId: string = req.params.emailId;

  try {
   const mail = await prisma.mail.findFirst({
     where: {
       id: mailId,
       senderId: req.tokenData.id,
       createdAt: {
         gt: new Date().toISOString(),
       },
     },
   });

 
   if (mail!==null) {
    await prisma.sendMailProperty.update({
        where: {
            mailId: mailId, 
        },
        data: {
            deleted: true,
        }
    })
   }

   await prisma.receivedMailProperty.update({
     where: {
       mailId: mailId,
     },
     data: {
       deleted: true,
     },
   });

   res.json({message: "Scheduled mail cancelled successfully!"})
  
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
