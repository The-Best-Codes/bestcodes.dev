declare module "zeptomail" {
  export class SendMailClient {
    constructor(options: SendMailClientOptions);
    sendMail(mailOptions: MailOptions): Promise<any>;
  }

  export interface SendMailClientOptions {
    url: string;
    token: string;
  }

  export interface MailOptions {
    from: EmailAddress;
    to: Recipient[];
    subject: string;
    htmlbody: string;
  }

  export interface EmailAddress {
    address: string;
    name: string;
  }

  export interface Recipient {
    email_address: EmailAddress;
  }
}
