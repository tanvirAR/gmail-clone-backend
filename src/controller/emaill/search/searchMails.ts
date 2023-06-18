import queryStringProcess from "querystring";
import { Request, Response } from "express";
import prisma from "../../../prismaclient/prismaClient";
import findSingleUser from "../../../utils/findUser";
import validateEmail from "../../../utils/emailValidator";
import getAdditionalMailProperty from "../../../utils/searchMailAdditionalProperty";
import { searchMailType } from "../../../interface/searchMailType.interface";

export async function searchMail(req: Request, res: Response) {
  const queryString = req.params.query;
  interface dataInterface {
    [key: string]: string | string[] | boolean | undefined;
    from?: string;
    to?: string;
    dateWithIn?: string;
    hasWords?: string[];
    doesNotHaveWords?: string[];
    subject?: string;
    hasAttachment?: true;
    type?: searchMailType;
  }

  const params = new URLSearchParams(queryString);
  const data: dataInterface = {};

  for (const [key, value] of params.entries()) {
    if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else if (key === "hasWords") {
      data[key] = value.split(",");
    } else if (key === "doesNotHaveWords") {
      data[key] = value.split(",");
    } else {
      data[key] = value;
    }
  }

  //  calculate time like within 1 day , (data.dateWithin is number in days)
  const xTimeAgo = new Date();
  xTimeAgo.setDate(xTimeAgo.getDate() - parseInt(data.dateWithIn || "1"));

  const emailFromValid = validateEmail(data.from || "");
  const emailToValid = validateEmail(data.to || "");

  let endUserId = "";

  if (data.from !== "" && data.to) {
    if (data.from && data.from !== req.tokenData.email && emailFromValid) {
      const user = await findSingleUser(data.from);
      endUserId = user ? user.id : "";
    } else if (data.to !== req.tokenData.email && emailToValid) {
      const user = await findSingleUser(data.to);
      endUserId = user ? user.id : "";
    }
  } else if (data.from !== "" && emailFromValid) {
    if (data.from && data.from !== req.tokenData.email) {
      const user = await findSingleUser(data.from);
      endUserId = user ? user.id : "";
    }
  } else if (data.to && data.to !== req.tokenData.email && emailToValid) {
    const user = await findSingleUser(data.to);
    endUserId = user ? user.id : "";
  }

  const hasWordsOption =
    data.hasWords && data.hasWords.length > 0
      ? data.hasWords.flatMap((word) => [
          {
            subject: { contains: "" },
            message: { contains: word },
          },
          {
            subject: { contains: word },
            message: { contains: "" },
          },
        ])
      : undefined;

  const doesNotContains =
    data.doesNotHaveWords !== undefined && data.doesNotHaveWords.length > 0
      ? data.doesNotHaveWords.flatMap((word) => [
          {
            subject: { contains: "" },
            message: { contains: word },
          },
          {
            subject: { contains: word },
            message: { contains: "" },
          },
        ])
      : undefined;

  const types = [
    "allmail",
    "inbox",
    "starred",
    "sent",
    "spam",
    "trash",
    "spam&trash",
    "read",
    "unread",
  ];

  let sendMailPropertyPrisma;
  let receivedMailPropertyPrisma;
  if (data?.type) {
    const { sendMailProperty, receivedMailProperty } =
      getAdditionalMailProperty(data.type);
    sendMailPropertyPrisma = sendMailProperty;
    receivedMailPropertyPrisma = receivedMailProperty;
  }

  const endUserEmailId = endUserId === "" ? undefined : endUserId;
  const attachmentQuery = data.hasAttachment ? { not: null } : undefined;
  try {
    const mails = await prisma.mail.findMany({
      where: {
        OR: [
          {
            receiverId: req.tokenData.id,
            senderId: {
              contains: endUserEmailId,
            },

            createdAt: {
              gte: xTimeAgo.toISOString(),
            },

            attachment: attachmentQuery,

            subject: {
              contains: data.subject !== "" ? data.subject : "",
            },
            OR: hasWordsOption,

            NOT: {
              OR: doesNotContains,
            },

            receiveMailProperty: {
              OR: receivedMailPropertyPrisma,
            },
          },
          {
            senderId: req.tokenData.id,
            receiverId: endUserEmailId,
            createdAt: {
              gte: xTimeAgo.toISOString(),
            },

            attachment: {
              not: attachmentQuery,
            },

            subject: {
              contains: data.subject,
            },
            OR: hasWordsOption,
            NOT: {
              OR: doesNotContains,
            },
            sendMailProperty: {
              OR: sendMailPropertyPrisma,
            },
          },
        ],
      },
    });

    if (mails) {
      res.json({ mails: mails });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
