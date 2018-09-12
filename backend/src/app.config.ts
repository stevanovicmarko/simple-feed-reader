import { config } from 'dotenv';
config();

export const SERVER_HOST = process.env.HOST || '0.0.0.0';
export const SERVER_PORT = parseInt(process.env.PORT || '3000', 10);

export const MONGODB_HOST = process.env.MONGODB_HOST || '0.0.0.0';
export const MONGODB_PORT = process.env.MONGODB_PORT || '27017';
export const DB_NAME = process.env.DB_NAME || 'feed_users';

export const MONGODB_URI = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${DB_NAME}`;

