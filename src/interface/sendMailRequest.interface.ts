interface sendmail {
    email: string;
    message?: string;
    subject?: string;
    attachment?: string;
    time?: any

}

// final interface for sendMail
// atleast one property must be present from message, subject attachment
export type sendMailInterface = sendmail &
  ({ message: string } | { subject: string } | { attachment: string });

export type sentScheduledMailInterface = sendmail &
  ({ message: string } | { subject: string } | { attachment: string });