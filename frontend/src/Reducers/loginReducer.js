import { EMAIL_CHANGED, PASSWORD_CHANGED} from '../Constants/loginConstants';

const initialState = {
  email: '',
  password: '',
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_CHANGED: {
      return state;
    }
    case PASSWORD_CHANGED: {
      return state;
    }
    default:
      return state;
  }
}

export default loginReducer;