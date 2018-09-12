import 'mocha';
import mongoose from 'mongoose';

import { MONGODB_URI } from '../app.config';

// establish connection
before(async () => {
  try {
    await mongoose.connect(
      MONGODB_URI,
      { useNewUrlParser: true }
    );
    console.log('Mongo connected.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

// close connection
after(async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongo closed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
