import { Request, Response } from 'express';

import { RssFeed } from '../models/rssFeedModel';
import { IUserDocument, User } from '../models/userModel';
import { RssHttpHandler } from '../services/rssHttpHandler';

export const getAllFeeds = async (req: Request, res: Response) => {
  const user = await User.findOne(req.user as IUserDocument)
       .populate('userFeeds');

  if (!user) {
    return res.status(403).json({ Error: 'no feeds Available' });
  }
  res.status(200).json({ feeds: user.userFeeds });
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string | undefined;

    if (!id) {
      return res.status(422).json({ error: 'invalid request params' });
    }

    const rssFeed = await RssFeed.findById(id);

    if (rssFeed) {
      res.status(200).json(rssFeed);
    } else {
      res.status(404).json({ error: 'unknown feed id' });
    }
  } catch (e) {
    // TODO: Use error handling middleware
    res.status(500).json({ error: 'internal server error' });
  }
};

export const addFeed = async (req: Request, res: Response) => {
  try {
    const feedUrl = req.body.url as string | undefined;
    const user = req.user as IUserDocument;

    if (!feedUrl) {
      return res.status(400).json({ error: 'invalid request params' });
    }

    const feeds = await RssFeed.find({
      $and: [{ _id: { $in: user.userFeeds } }, { url: { $in: feedUrl } }],
    });

    if (feeds && feeds.length) {
      return res.status(403).json({ error: 'feed already exists' });
    }

    const rssHttpHandler = new RssHttpHandler(feedUrl);
    const articles = await rssHttpHandler.getArticles();
    const feed = new RssFeed({
      url: feedUrl,
      articles,
      user,
    });

    await feed.save();
    await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { userFeeds: feed } }
    );
    res.status(201).json({
      success: 'Added rss feed',
      feedId: feed.id,
      latestArticles: articles,
    });
  } catch (err) {
    // TODO: Use error handling middleware
    res.status(500).json({ error: 'internal server error' });
  }
};

export const replaceFeed = async (req: Request, res: Response) => {
  try {
    const feedUrl = req.body.url as string | undefined;
    const feedId = req.params.id as string | undefined;

    if (!feedUrl || !feedId) {
      return res.status(400).json({ error: 'invalid request params' });
    }

    const feed = await RssFeed.findById(feedId);

    if (!feed) {
      return res
        .status(403)
        .json({ error: 'feed you want to update does not exist' });
    }

    const rssHttpHandler = new RssHttpHandler(feedUrl);
    const newArticles = await rssHttpHandler.getArticles();

    const replacedFeed = await RssFeed.findOneAndUpdate(
      { _id: feedId },
      { articles: newArticles, url: feedUrl },
      { new: true }
    );

    if (!replacedFeed) {
      return res.status(403).json({ error: 'could not save replaced feed' });
    }

    res.status(201).json({ success: 'replaced rss feed', replacedFeed });
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
};

export const deleteFeed = async (req: Request, res: Response) => {
  try {
    const feedId = req.params.id as string | undefined;

    if (!feedId) {
      return res.status(400).json({ error: 'invalid request params' });
    }

    const feedToRemove = await RssFeed.findById(feedId);

    if (!feedToRemove) {
      return res
        .status(403)
        .json({ error: 'feed you want to update does not exist' });
    }

    await feedToRemove.remove();
    res.status(201).json({ success: 'feed successfully removed' });
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
};
