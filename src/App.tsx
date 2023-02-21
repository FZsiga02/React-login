import React, { Component, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';

interface State {
  username: string;
  password: string;
  loginError: string;
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loginError: '',
    }
  }

  handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const loginData = {
      'username': this.state.username,
      'password': this.state.password,
    };

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      if (response.status == 401) {
        this.setState({ loginError: 'Hibás név vagy jelszó' });
      } else {
        this.setState({ loginError: 'Szerver hiba' });
      }
      return;
    }
    const responseBody = await response.json();
    console.log(responseBody.token)
  }

  render() {
    return <div>
      <form onSubmit={this.handleLogin}>
        <label>
          Username:<br/>
          <input type="text" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })}/>
        </label>
        <br/>
        <label>
          Password:<br/>
          <input type="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })}/>
        </label>
        <br/>
        <p>{ this.state.loginError }</p>
        <input type="submit" value="Login" />
      </form>
    </div>
  }
}

export default App;
