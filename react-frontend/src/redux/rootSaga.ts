import { all, ForkEffect, GenericAllEffect } from 'redux-saga/effects';

import { helloSaga, watchIncrementAsync } from './login/loginSagas';

export default function* rootSaga(): IterableIterator<
  GenericAllEffect<IterableIterator<void> | IterableIterator<ForkEffect>>
> {
  yield all([helloSaga(), watchIncrementAsync()]);
}
