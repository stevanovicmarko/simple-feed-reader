import * as React from 'react';

import { Provider } from 'react-redux';

import './App.css';
import Login from './components/loginComponent';
import logo from './logo.svg';
import store from './redux/store';


class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Simple Feed Reader</h1>
        </header>
        <Login />
      </div>
      </Provider>
    );
  }
}

export default App;
