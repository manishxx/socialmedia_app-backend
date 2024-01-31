import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}
const log: Logger = config.createLogger('mailOptions');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(recieverEmail: string, subject: string, body: string) {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'develop') {
      this.developmentEmailSender(recieverEmail, subject, body);
    } else {
      this.productionEmailSender;
    }
  }

  private async developmentEmailSender(recieverEmail: string, subject: string, body: string): Promise<void> {
    log.info('hitting the transporter now...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });
    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL}>`,
      to: recieverEmail,
      subject,
      html: body
    };

    try {
      await transporter.sendMail(mailOptions);

      log.info('Development Email sent succefully');
    } catch (error) {
      log.error('Error sending development Email ', error);
      throw new BadRequestError('Could Not Send Development Mail');
    }
  }
  private async productionEmailSender(recieverEmail: string, subject: string, body: string): Promise<void> {
    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL}>`,
      to: recieverEmail,
      subject,
      html: body
    };
    try {
      await sendGridMail.send;
      log.info('Production Email Send Successfully');
    } catch (error) {
      log.error('Error sending Mail ', error);
      throw new BadRequestError('Could Not Send Mail');
    }
  }
}
export const mailTransport: MailTransport = new MailTransport();
