import { EMAIL_CHANGED, PASSWORD_CHANGED} from '../Constants/loginConstants';

export const onEmailChanged = payload => ({
  type: EMAIL_CHANGED,
  payload,
});

export const onPasswordChanged = payload => ({
  type: PASSWORD_CHANGED,
  payload
});
