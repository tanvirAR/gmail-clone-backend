import { sendMailProperty, receivedMailProperty } from "@prisma/client";
import prisma from "../prismaclient/prismaClient";

  /* this function recieves a single email property and returns a object to the user which tells the user , in which pages this email will be present , like if inbox is true, it means the emaill will be present in the inbox page. This function is only used for cache update in the frontend when user mutates an email's property  */

async function veryEmailTypeReceivedProperty(email: receivedMailProperty) {
  try {
    const primaryProperty = await prisma.mail.findUnique({
      where: {
        id: email.mailId,
      },
    });

    // const snooze = sendProperty?.snooze ? sendProperty.snooze : false
    const sent = false;

    const data = {
      inbox: false,
      starred: false,
      snozzed: false,
      sent: false,
      spam: false,
      scheduled: false,
      trash: false,
      important: false,
    };

    const {
      deleted,
      important,
      inbox,

      spam,
      starred,
      trashBin,
      snoozedTime,
      scheduleSend,
    } = email;

    const snoozedTimeIsLessThanCurrTime: boolean =
      new Date(snoozedTime) < new Date();
    const createdAtIsGtCurrentTime: boolean =
      new Date() < new Date(primaryProperty?.createdAt || "");

    data.inbox =
      (!deleted &&
        inbox &&
        !trashBin &&
        !spam &&
        snoozedTimeIsLessThanCurrTime) ||
      (inbox && !deleted && !trashBin && !spam);

    data.starred = !deleted && !spam && !trashBin && starred;

    data.snozzed = !createdAtIsGtCurrentTime && !snoozedTimeIsLessThanCurrTime;

    data.sent =
      (!deleted && !trashBin && !spam && sent && !scheduleSend) ||
      (!deleted &&
        !trashBin &&
        !spam &&
        sent &&
        scheduleSend &&
        !createdAtIsGtCurrentTime);

    data.spam = !deleted && !trashBin && spam;

    data.scheduled =
      !deleted &&
      createdAtIsGtCurrentTime &&
      !trashBin &&
      !spam &&
      scheduleSend;

    data.trash = !deleted && trashBin && !spam;

    data.important = !deleted && !spam && !trashBin && important;

    return data;
  } catch (error) {
  }
}

export default veryEmailTypeReceivedProperty;
