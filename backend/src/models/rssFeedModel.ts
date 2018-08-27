import mongoose, { Document, Model, model, Schema } from 'mongoose';
import {
  IUserDocument,
  IUserModel,
} from './userModel';

export interface IArticle extends mongoose.Types.Subdocument {
  author: string;
  date: Date;
  title: string;
  link: string;
}

const getUnreadArticles = 'getUnreadArticles';
export interface IRssFeedDocument extends Document {
  url: string;
  articles: IArticle[];
  user: Schema.Types.ObjectId;
  [getUnreadArticles]: (startingDate?: Date) => IArticle[];
}

const urlRegex = new RegExp(
  '^' +
    // protocol identifier
    '(?:(?:https?|ftp)://)' +
    // userRef:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    // TLD may end with dot
    '\\.?' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:[/?#]\\S*)?' +
    '$',
  'i'
);

const ArticleSchema = new Schema({
  author: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: Date,
  },
  link: {
    required: true,
    type: String,
    validate: urlRegex,
  },
  title: {
    required: true,
    type: String,
  },
});

const RssSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  articles: [ArticleSchema],
  url: {
    // index: { unique: true },
    lowercase: true,
    required: true,
    type: String,
    validate: urlRegex,
  },
});

RssSchema.method(getUnreadArticles, function(
  this: IRssFeedDocument,
  startingDate: Date = new Date()
): IArticle[] {
  return this.articles.filter(
    ({ date }) => date.getTime() >= startingDate.getTime()
  );
});

RssSchema.pre<IRssFeedDocument>('remove', async function(
  this: IRssFeedDocument
) {
  const User = model<IUserDocument, IUserModel>(
    'User'
  );
  await User.findOneAndUpdate(
    { _id: this.user },
    { $pull: { userFeeds: this._id } }
  );
});

export const RssFeedModelName = 'RssFeed';
export const RssFeed = model<IRssFeedDocument>(RssFeedModelName, RssSchema);
