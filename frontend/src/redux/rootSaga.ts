import { all } from 'redux-saga/effects';

import { helloSaga, watchIncrementAsync } from './login/loginSagas';

export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}