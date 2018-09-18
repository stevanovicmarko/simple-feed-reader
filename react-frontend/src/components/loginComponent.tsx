import * as React from 'react';

import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  asyncIncrementCounter,
  decrementCounter,
  ILoginActions,
  incrementCounter,
} from '../redux/login/loginEntity';

const form: React.SFC<ILoginActions> = props => (
  <FormGroup
    helperText="Helper text with details..."
    label="Label A"
    labelFor="text-input"
    labelInfo="(required)"
  >
    <InputGroup id="text-input" placeholder="Placeholder text" />
    <Button onClick={props.incrementCounter} text="Sync Inc" />
    <br />
    <Button onClick={props.decrementCounter} text="Sync Dec" />
    <br />
    <Button onClick={props.asyncIncrementCounter} text="Async Inc" />
  </FormGroup>
);

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ asyncIncrementCounter, incrementCounter, decrementCounter }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(form);
