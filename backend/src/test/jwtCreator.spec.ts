import { expect } from 'chai';
import 'mocha';

import {generateTokenForUser} from '../services/jwtCreator';
import { User } from '../models/userModel';

describe('generateTokenForUser function', () => {

  const user = new User({
    email: 'example@example.com',
    password: 'acvdder',
  });

  it('should return a string', () => {
    const token = generateTokenForUser(user);
    expect(token).to.be.a('string');
  });

  it('should have a length of at least of 100 chars', () => {
    const token = generateTokenForUser(user);
    expect(token).to.have.length.above(100);
  });
});
