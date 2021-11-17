import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { encodeJwt } from '../../libs/jwt';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public send(email: string): void {
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'long2291999@outlook.com', // Senders email address
        subject: 'Verify Your Account ✔', // Subject line
        html: `<b>Click Here : http://localhost:3000/auth/verify/${encodeJwt({
          email,
        })}</b>`, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
