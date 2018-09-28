import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { MONGODB_URI, SERVER_HOST, SERVER_PORT } from './app.config';

import routes from './routes/routes';

// express setup
const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
app.use(helmet());

// routes setup
app.use('/', routes);

// mongodb setup
mongoose.set('useCreateIndex', true);

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true },
  )
  .then(() => {
    app.listen(SERVER_PORT, SERVER_HOST, () =>
      console.log(
        `Server now listening on http://${SERVER_HOST}:${SERVER_PORT}`
      )
    );
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
