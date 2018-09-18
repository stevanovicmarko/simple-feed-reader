import { AnyAction, Reducer } from 'redux';
import { action } from 'typesafe-actions';

// shorthand for `{ [key: string]: any }`.
// export type ApiResponse = Record<string, any>

export const enum LoginActionTypes {
  INCREMENT = '@@login/INCREMENT',
  DECREMENT = '@@login/DECREMENT',
  ASYNC_INCREMENT = '@@login/ASYNC_INCREMENT',
}

export const incrementCounter = () => action(LoginActionTypes.INCREMENT);
export const decrementCounter = () => action(LoginActionTypes.DECREMENT);
export const asyncIncrementCounter = () => action(LoginActionTypes.ASYNC_INCREMENT);

export interface ILoginActions {
  incrementCounter: typeof incrementCounter;
  decrementCounter: typeof decrementCounter;
  asyncIncrementCounter: typeof asyncIncrementCounter;
}

export interface ICounterState {
  readonly count: number;
}

const initialState: ICounterState = {
  count: 0,
};

const counterReducer: Reducer<ICounterState> = (state = initialState, Action: AnyAction) => {
  switch (Action.type) {
    case LoginActionTypes.INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };
    case LoginActionTypes.DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
};

export default counterReducer;
