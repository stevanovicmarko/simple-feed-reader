import { NextFunction, Request, Response } from 'express';

import { IUserDocument, User } from '../models/userModel';
import { generateTokenForUser } from '../services/jwtCreator';

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: 'invalid request' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ error: 'email is taken' });
    }

    const user = new User({ email, password });
    const newUser = await user.save();
    res.status(200).json({ token: generateTokenForUser(newUser) });
  } catch (err) {
    return next(err);
  }
};

export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as IUserDocument | undefined;

  try {
    if (!user) {
      return res.status(403).send({ error: 'userRef not provided' });
    }

    const existingUser = await User.findOne({ _id: user._id });
    if (!existingUser) {
      return res
        .status(403)
        .send({ error: "couldn't find userRef in the database" });
    }
    await existingUser.remove();
    res.status(201).send({ success: 'userRef successfully removed' });
  } catch (err) {
    return next(err);
  }
};
