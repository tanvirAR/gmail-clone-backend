import express from "express";

// internal import
import { checkLogin } from "../middleware/common/checkLogin";
import { sendMail } from "../controller/emaill/create/sendEmail";
import {
  sendMailValidator,
  sendMailValidationHandler,
} from "../middleware/email/sendEmailValidator";
import { getUserEmails } from "../controller/emaill/inbox/getUsersEmails";
import {
  markMailAsRead,
  markMailAsUnRead,
} from "../controller/emaill/readProperty/markEmailAsRead";
import { markMailAsStarred, markMailAsUnStarred } from "../controller/emaill/starred/emailSetStarred";
import { markMailAsTrash } from "../controller/emaill/trash/markTrash";
import { getUsersTrashMails } from "../controller/emaill/trash/getTrashMails";
import { getSingleMail } from "../controller/emaill/singleEmail/getSingleMail";
import { getAdditionalSingleMailProperty } from "../controller/emaill/additionalProperty/getMailProperty";
import { markMailAsImportant, markMailAsUnImportant } from "../controller/emaill/important/markMailImportant";
import { getSentMails } from "../controller/emaill/sent/getSentMails";
import { getImportantMails } from "../controller/emaill/important/getImportantMails";
import { getStarredMails } from "../controller/emaill/starred/getStarredMails";
import { markMailAsSpam, markMailAsUnSpam } from "../controller/emaill/spam/markMailSpam";
import { getSpamMails } from "../controller/emaill/spam/getSpamMails";
import { getAdvertisedMails } from "../controller/emaill/advertised/getAdvertisedMails";
import { markMailAsAdvertised } from "../controller/emaill/advertised/markMailAsAdvertised";
import { getSocialMails } from "../controller/emaill/social/getSocialMails";
import { markMailAsSocial } from "../controller/emaill/social/markMailAsSocial";
import createScheduledMail from "../controller/emaill/scheduled/sentScheduledMail";
import { getScheduledSentEmails } from "../controller/emaill/scheduled/getScheduledSentMail";
import { markMailAsSnoozed } from "../controller/emaill/snooze/markMailAsSnoozed";
import { getSnoozedMails } from "../controller/emaill/snooze/getSnoozedMails";
import { cancellSnoozeMail } from "../controller/emaill/snooze/cancellSnoozeMail";
import { deleteMailPermanently } from "../controller/emaill/delete/deleteMail";
import { cancellScheudledMailFromSending } from "../controller/emaill/scheduled/cancellScheduledMail";
import { moveSentMailToInbox } from "../controller/emaill/moveTo/moveSentToInbox";
import { moveSpamToInbox } from "../controller/emaill/moveTo/moveFromSpamToInbox";
import { moveTrashToInbox } from "../controller/emaill/moveTo/moveFromTrashToInbox";
import { searchMail } from "../controller/emaill/search/searchMails";

const router = express.Router();

// get all received email
router.get("/getmails", checkLogin, getUserEmails);

// get sent mails
router.get("/getmails/sent", checkLogin, getSentMails);

// get all trash mails
router.get("/getmails/trash", checkLogin, getUsersTrashMails);

// get starred mails
router.get("/getmails/starred", checkLogin, getStarredMails);

// get important mails
router.get("/getmails/important", checkLogin, getImportantMails);

// send a new mail
router.post(
  "/sendmail",
  checkLogin,
  sendMailValidator,
  sendMailValidationHandler,
  sendMail
);

// mark mail as snoozed
router.post("/mark/snoozed", checkLogin, markMailAsSnoozed);

// cancel snooze mail
router.patch('/snooze/cancell', checkLogin, cancellSnoozeMail);


// get single mail
router.get("/singlemail/:emailId", checkLogin, getSingleMail);

// get additional single mail data either from sendmail or receivedmail property (schema)
router.get(
  "/singlemail/property/:emailId",
  checkLogin,
  getAdditionalSingleMailProperty
);

// mark  email as important
router.post("/mark/important/:emailId", checkLogin, markMailAsImportant);

// mark  email as UnImportant
router.post("/mark/unimportant/:emailId", checkLogin, markMailAsUnImportant);

// mark email as trash
router.post("/trash/:emailId", checkLogin, markMailAsTrash);

// mark email as starred
router.post("/mark/starred/:emailId", checkLogin, markMailAsStarred);

// mark email as UnStarred
router.post("/mark/unstarred/:emailId", checkLogin, markMailAsUnStarred);

//mark new send email as read
router.post("/mark/read", checkLogin, markMailAsRead);

//mark new send email as Unread
router.post("/mark/unread", checkLogin, markMailAsUnRead);

// mark mail as spam
router.post("/mark/spam", checkLogin, markMailAsSpam);

// mark mail as unspam
router.post("/mark/unspam", checkLogin, markMailAsUnSpam);

// get spam mails
router.get("/getmails/spam", checkLogin, getSpamMails);

// mark email as social
router.post("/mark/social", checkLogin, markMailAsSocial);

// get social mails
router.get("/getmails/social", checkLogin, getSocialMails);

// mark email as type advertise / promotions
router.post("/mark/promotions", checkLogin, markMailAsAdvertised);

// get advertise emails
router.get("/getmails/social", checkLogin, getAdvertisedMails);

// create scheduled mail 
router.post("/sendmail/scheduled", checkLogin, createScheduledMail)

// get scheduled sent mails 
router.get("/getmails/scheduled", checkLogin, getScheduledSentEmails)

// cancell scheduled mail
router.delete("/scheduled/cancell/:emailId", checkLogin, cancellScheudledMailFromSending)

// get snoozed mails
router.get("/getmails/snoozed", checkLogin, getSnoozedMails);

// dele a email permanently
router.delete("/mail/delete/:emailId", checkLogin, deleteMailPermanently)


// move email from sent to inbox
router.patch("/move/sent/to/inbox", checkLogin, moveSentMailToInbox)

// move email from spam to inbox
router.patch("/move/spam/to/inbox", checkLogin, moveSpamToInbox)

// move email from trash to inbox
router.patch("/move/trash/to/inbox", checkLogin, moveTrashToInbox)


// search mail
router.get("/search/:query", checkLogin, searchMail) 

export default router;
