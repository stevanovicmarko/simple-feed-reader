import { expect } from 'chai';
import faker from 'faker';
import 'mocha';

import { IArticle, RssFeed } from '../models/rssFeedModel';

describe('RssFeed Model', () => {
  beforeEach(async () => {
    await RssFeed.remove({}).catch(err => {
      console.error(err);
      process.exit(1);
    });
  });

  it('should successfully save a new feed source', async () => {
    const article: IArticle = {
      author: faker.name.findName(),
      date: faker.date.recent(10),
      link: faker.internet.url(),
      title: faker.hacker.phrase(),
    } as IArticle;

    const feed = new RssFeed({
      url: faker.internet.url(),
      articles: [article],
    });

    const savedFeed = await feed.save();
    expect(savedFeed).to.be.an.instanceof(RssFeed);
  });
});
