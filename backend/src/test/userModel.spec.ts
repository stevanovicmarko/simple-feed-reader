import { expect } from 'chai';
import 'mocha';
import mongoose from 'mongoose';

import faker from 'faker';

import { IArticle, RssFeed, RssFeedModelName } from '../models/rssFeedModel';
import { IUserDocument, User, UserModelName } from '../models/userModel';

describe('User Model', () => {
  beforeEach(async () => {
    await User.remove({}).catch(err => {
      console.error(err);
      process.exit(1);
    });
  });

  after(() => {
    delete mongoose.models[UserModelName];
    delete mongoose.models[RssFeedModelName];
  });

  it('should successfully save an new userRef', async () => {
    const user = new User({
      email: 'example@example.com',
      password: 'abcdefghijk',
    });
    const savedUser = await user.save();
    expect(savedUser).to.be.an.instanceof(User);
  });

  it('should successfully find saved userRef', async () => {
    const user = new User({
      email: 'example@example.com',
      password: 'abcdefghijkl',
    });
    await user.save();
    const savedUser = await User.findOne(user);
    expect(savedUser).to.be.an.instanceof(User);
  });

  it('should not find non-existing userRef', async () => {
    const user = new User({
      email: 'example@example.com',
      password: 'abcdefghijkl',
    });
    await user.save();
    const savedUser = await User.findOne(user);
    await User.remove(savedUser);
    const emptyUser = await User.findOne(savedUser);
    expect(emptyUser).to.be.a('null');
  });

  it('should fail to save userRef with missing email', async () => {
    const user = new User({
      email: '',
      password: 'abcdefghijkl',
    });
    await user.validate().catch(err => expect(err.name).to.be.a('string'));
  });

  it('should fail to save userRef with invalid email', async () => {
    const user = new User({
      email: 'email@ax',
      password: 'abcdefghijkl',
    });
    await user.validate().catch(err => expect(err.name).to.be.a('string'));
  });

  it('should fail to save userRef with missing password', async () => {
    const user = new User({
      email: 'email@abc.def',
      password: '',
    });
    await user.validate().catch(err => expect(err.name).to.be.a('string'));
  });

  it('should fail to save userRef with too short password', async () => {
    const user = new User({
      email: 'email@abc.def',
      password: '1234567',
    });
    await user.validate().catch(err => expect(err.name).to.be.a('string'));
  });

  it('should fail to save userRef if email is taken', async () => {
    const firstUser = new User({
      email: 'email@abc.def',
      password: 'abcdefghijkl',
    });

    const secondUser = new User({
      email: 'email@abc.def',
      password: '12213e21312432',
    });

    await Promise.all([firstUser.save(), secondUser.save()]).catch(err =>
      expect(err.name).to.be.a('string')
    );
  });

  it('should successfully save feed for an existing userRef', async () => {
    const firstArticle: IArticle = {
      author: faker.name.findName(),
      date: faker.date.recent(10),
      link: faker.internet.url(),
      title: faker.hacker.phrase(),
    } as IArticle;

    const secondArticle: IArticle = {
      author: faker.name.findName(),
      date: faker.date.recent(10),
      link: faker.internet.url(),
      title: faker.hacker.phrase(),
    } as IArticle;

    const feeds = new RssFeed({
      url: faker.internet.url(),
      articles: [firstArticle, secondArticle],
    });

    const user = new User({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    user.userFeeds.push(feeds);

    await feeds.save();
    await user.save();

    const { userFeeds } = (await User.findOne(user).populate(
      'userFeeds'
    )) as IUserDocument;

    expect(userFeeds[0].articles).to.have.lengthOf(2);
  });

  it('should successfully remove all articles when a userRef is removed', async () => {
    const firstArticle: IArticle = {
      author: faker.name.findName(),
      date: faker.date.recent(10),
      link: faker.internet.url(),
      title: faker.hacker.phrase(),
    } as IArticle;

    const secondArticle: IArticle = {
      author: faker.name.findName(),
      date: faker.date.recent(10),
      link: faker.internet.url(),
      title: faker.hacker.phrase(),
    } as IArticle;

    const feeds = new RssFeed({
      url: faker.internet.url(),
      articles: [firstArticle, secondArticle],
    });

    const user = new User({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    user.userFeeds.push(feeds);

    await feeds.save();
    await user.save();

    const savedUser = (await User.findOne(user).populate(
      'userFeeds'
    )) as IUserDocument;

    const { userFeeds } = savedUser;
    await savedUser.remove();

    const feedResults = await RssFeed.find({ _id: { $in: userFeeds } });
    expect(feedResults).to.have.lengthOf(0);
  });
});
