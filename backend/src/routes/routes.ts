import { Router } from 'express';

import * as authController from '../controllers/authController';
import * as feedController from '../controllers/rssFeedController';
import * as userController from '../controllers/userController';

import { authMiddleware, signinMiddleware } from '../middleware/passportMiddleware';

const routes = Router();

// login route
routes.post('/signin', signinMiddleware, authController.signIn);

// addUser route, unprotected
routes.post('/users', userController.addUser);

// remove userRef route
routes.delete('/users', authMiddleware, userController.removeUser);

// get all feeds
routes.get('/feeds', authMiddleware, feedController.getAllFeeds);

// get all articles for a specific feed
routes.get('/feeds/:id', feedController.getFeed);

// add a new feed
routes.post('/feeds', authMiddleware, feedController.addFeed);

// replace all articles for an specific feed
routes.put('/feeds/:id', authMiddleware, feedController.replaceFeed);

// update articles for an specific feed
// routes.patch('/feeds/:id', authMiddleware, (req, res) => {
  // TODO: implement patch
// });

// delete an specific feed
routes.delete('/feeds/:id', authMiddleware, feedController.deleteFeed);

// catch-all route
routes.get('*', (req, res) =>
  res.status(404).json({ error: 'unknown route' }));

export default routes;
