import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../models/userModel';

export interface IJwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

const localLogin = new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false);
      }

      const isMatch = await user.comparePassword(password);
      done(null, isMatch ? user : false);
    } catch (err) {
      done(err, false);
    }
  }
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SIGN_KEY || 'super_secret',
};

const jwtLogin = new JwtStrategy(
  jwtOptions,
  async (payload: IJwtPayload, done: VerifiedCallback) => {
    const user = await User.findById(payload.sub).catch(err =>
      done(err, false)
    );
    done(null, user || false);
  }
);

passport.use(localLogin);
passport.use(jwtLogin);

export const authMiddleware = passport.authenticate('jwt', { session: false });
export const signinMiddleware = passport.authenticate('local', { session: false });
