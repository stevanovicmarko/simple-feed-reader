import * as bcrypt from 'bcrypt';

import { Document, Model, model, Schema } from 'mongoose';
import { IRssFeedDocument, RssFeed, RssFeedModelName } from './rssFeedModel';

// export type IUser = IUserDocument & Record<'comparePassword', (password: string) => Promise<boolean>>;

const comparePassword = 'comparePassword';
// export interface IUser extends IUserDocument {
//   [comparePassword](password: string): Promise<boolean>;
// }

export interface IUserDocument extends Document {
  email: string;
  password: string;
  userFeeds: IRssFeedDocument[];
  [comparePassword](password: string): Promise<boolean>;
}

const hashPassword = 'hashPassword';

export interface IUserModel extends Model<IUserDocument> {
  [hashPassword](password: string): Promise<string>;
}

export const userSchema: Schema = new Schema({
  email: {
    index: { unique: true },
    lowercase: true,
    required: true,
    type: String,
    validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: { type: String, required: true, minlength: 8 },
  userFeeds: [
    {
      type: Schema.Types.ObjectId,
      ref: RssFeedModelName,
    },
  ],
});

userSchema.method(comparePassword, async function(
  this: IUserDocument,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
});

userSchema.pre<IUserDocument>('save', async function(this: IUserDocument) {
    const { password } = this;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
});

userSchema.pre<IUserDocument>('remove', async function (this: IUserDocument) {
    await RssFeed.remove({ _id : {$in: this.userFeeds }});
});

userSchema.static(
  hashPassword,
  async (password: string): Promise<string> => bcrypt.hash(password, 10)
);

export const UserModelName = 'User';
export const User: IUserModel = model<IUserDocument, IUserModel>(
  UserModelName,
  userSchema
);
