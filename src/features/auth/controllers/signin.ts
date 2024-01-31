import { Request, Response } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@global/decorators/joi-validation-decorators';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { mailTransport } from '@service/emails/mail-transport';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { emailQueue } from '@service/queues/email.queue';
import Logger from 'bunyan';
const log: Logger = config.createLogger('Sign In');
export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUserName(username);
    //console.log(existingUser, username);
    log.info(`Logged in successfully, ${existingUser.username}`);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    const userJWT: string = JWT.sign(
      {
        userId: existingUser._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    // try {
    //   await mailTransport.sendEmail(`${config.SENDER_EMAIL}`, 'Test email', 'testing');
    // } catch (error) {
    //   log.error(error);
    // }

    // const resetLink = `${config.CLIENT_URL}/reset-password?token=23139127321879`;
    // const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    // emailQueue.addEmailJob('forgotPasswordEmail', {
    //   template: template,
    //   receiverEmail: 'vaughn87@ethereal.email',
    //   subject: 'Reset Your Password'
    // });
    req.session = { jwt: userJWT };
    res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully', user: existingUser, token: userJWT });
  }
}
