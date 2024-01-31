import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import Logger from 'bunyan';
import { config } from '@root/config';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
const log: Logger = config.createLogger('Sign In');

export class SignOut {
  public async update(req: Request, res: Response): Promise<void> {
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'Log Out Successful', user: {}, token: '' });

    log.info(`Logged out successfully`);
  }
}
