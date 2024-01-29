import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { NotAuthorizedError } from './error-handler';
import { AuthPayload } from '@auth/interfaces/auth.interface';
export class AuthMiddleWare {
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please Log in again.');
    }

    try {
      const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not Valid. Please log in again');
    }
    next();
  }
  public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Not authorized to acces this route.');
    }
    next();
  }
}
export const authMiddleWare: AuthMiddleWare = new AuthMiddleWare();
