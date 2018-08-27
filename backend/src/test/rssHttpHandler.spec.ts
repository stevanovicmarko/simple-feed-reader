import { expect } from 'chai';
import { Item } from 'feedparser';
import 'mocha';

import { RssHttpHandler } from '../services/rssHttpHandler';

describe('RssHttpHandler class', () => {

  it('should return a valid for a given rss feed', async () => {
    const rssUrl = 'http://www.reddit.com/r/kde/.rss';
     const rssHttpHandler = new RssHttpHandler(rssUrl);
     const res: Item[] | Error = await rssHttpHandler.getArticles();
     expect(res).to.be.an.instanceof(Array);
  });

  it('should return an error for an invalid rss feed', async () => {
    const rssUrl = 'http://www.reddit.com/r/kde/.abc';
    const rssHttpHandler = new RssHttpHandler(rssUrl);
    const res: Item[] | Error = await rssHttpHandler.getArticles();
    expect(res).to.be.an.instanceof(Error);
  });

});
