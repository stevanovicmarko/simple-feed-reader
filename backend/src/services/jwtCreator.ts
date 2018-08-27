import { sign } from 'jsonwebtoken';
import { IUserDocument } from '../models/userModel';

export const jwtExpirationInterval = 30 * 24 * 60 * 60 * 1000; // 30 days

export const generateTokenForUser = (user: IUserDocument, expiresIn=jwtExpirationInterval): string => {
  const secretKey = process.env.SIGN_KEY || 'super_secret';
  const timestamp = Date.now();
  return sign({ sub: user.id, iat: timestamp }, secretKey, { expiresIn });
};
