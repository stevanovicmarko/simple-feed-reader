import { NextFunction, Request, Response } from 'express';

import { IUserDocument } from '../models/userModel';
import { generateTokenForUser } from '../services/jwtCreator';

export const signIn = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDocument | undefined;
  if (user) {
    return res.send({ token: generateTokenForUser(user) });
  }
  return next({ error: 'userRef not provided' });
};

