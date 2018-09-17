import { delay } from 'redux-saga'
import { ForkEffect, put, PutEffect, takeEvery } from 'redux-saga/effects';

import { incrementCounter, LoginActionTypes } from './loginEntity';


export function* helloSaga(): IterableIterator<void> {
  // tslint:disable-next-line
  console.log('Login Saga works');
}

export function* incrementAsync(): IterableIterator<Promise<true> | PutEffect<{ type: string; }>>{
  yield delay(1000);
  yield put(incrementCounter());
}

export function* watchIncrementAsync(): IterableIterator<ForkEffect> {
  yield takeEvery(LoginActionTypes.ASYNC_INCREMENT, incrementAsync);
}