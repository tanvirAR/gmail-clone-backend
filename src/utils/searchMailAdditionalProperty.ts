import { searchMailType, allMail, inbox, read, sent, spam, spamAndTrash, starred, trash, unread } from "../interface/searchMailType.interface";

interface additionalMailProp {
  deleted?: boolean;
  trashBin?: boolean;
  spam?: boolean;
  inbox?: boolean;
  snoozedTime?: any;
  snooze?: boolean;
  starred?: boolean;
  sent?: boolean;
  scheduleSend?: boolean;
  read?: boolean;
  unread?: boolean;
}




export default function getAdditionalMailProperty(type: searchMailType) {
  let sendMailProperty: additionalMailProp[] =  []; 
  let receivedMailProperty: additionalMailProp[] = [];

  switch (type.toLowerCase()) {
    case allMail:
     receivedMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
        },
      ];

      sendMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          // inbox: true,
          trashBin: false,
          spam: false,
          snooze: true,
        },
        {
          deleted: false,
          trashBin: false,
          sent: true,
          spam: false,
        },
      ];

      break;

    case inbox:
      receivedMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
        },
      ];

      sendMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
          snooze: true,
        },
      ];

      break;

    case spam:
      receivedMailProperty = [
        {
          deleted: false,
          trashBin: false,
          spam: true,
        },
      ];

      sendMailProperty = [
        {
          deleted: false,
          trashBin: false,
          spam: true,
        },
      ];
      break;

    case trash:
      receivedMailProperty = [
        {
          deleted: false,
          trashBin: true,
          spam: false,
        },
      ];

      sendMailProperty = [
        {
          trashBin: true,
          deleted: false,
          spam: false,
        },
      ];
      break;

    case spamAndTrash:
      receivedMailProperty = [
        {
          deleted: false,
          trashBin: true,
          spam: true,
        },
      ];

      sendMailProperty = [
        {
          trashBin: true,
          deleted: false,
          spam: true,
        },
      ];
      break;

    case starred:
      receivedMailProperty = [
        {
          deleted: false,
          trashBin: false,
          starred: true,
          spam: false,
        },
      ];

      sendMailProperty = [
        {
          trashBin: false,
          deleted: false,
          starred: true,
          spam: false,
        },
      ];
      break;

    case read:
      receivedMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
          read: true,
        },
      ];

      sendMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
          snooze: true,
          read: true,
        },
        {
          deleted: false,
          trashBin: false,
          sent: true,
          spam: false,
          scheduleSend: true,
          read: true,
        },
      ];

      break;

    case unread:
      receivedMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
          read: false,
        },
      ];

      sendMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
          snooze: true,
          read: false,
        },
        {
          deleted: false,
          trashBin: false,
          sent: true,
          spam: false,
          scheduleSend: true,
          read: false,
        },
      ];

      break;

    case sent:
  

     sendMailProperty = [
       {
         deleted: false,
         trashBin: false,
         sent: true,
         spam: false,
         scheduleSend: false,
       },
       {
         deleted: false,
         trashBin: false,
         sent: true,
         spam: false,
         scheduleSend: true,
       },
     ];

    break;
    
    default:
       receivedMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
        },
      ];

      sendMailProperty = [
        {
          deleted: false,
          snoozedTime: {
            lt: new Date().toISOString(),
          },
          inbox: true,
          trashBin: false,
          spam: false,
          snooze: true,
        },
        {
          deleted: false,
          trashBin: false,
          sent: true,
          spam: false,
          scheduleSend: true,
        },
      ];
  }

  return {sendMailProperty, receivedMailProperty}

}

