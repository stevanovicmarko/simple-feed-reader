import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';

export class App extends Component {
  public render() {
    return (
      <div>
        <form>
          <label htmlFor="choose">Email</label>
          <input id="email" name="email" required />
          <br/>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" required />
          <br/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app-root'));
