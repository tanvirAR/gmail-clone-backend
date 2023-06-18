export type searchMailType =
  | typeof allMail
  | typeof inbox
  | typeof starred
  | typeof sent
  | typeof spam
  | typeof trash
  | typeof spamAndTrash
  | typeof read
  | typeof unread;

export const allMail = "allmail";
export const inbox = "inbox";
export const starred = "starred";
export const sent = "sent";
export const spam = "spam";
export const trash = "trash";
export const spamAndTrash = "spam&trash";
export const read = "read";
export const unread = "unread";
