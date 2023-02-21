import React, { Component, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import ProfileData from './ProfileData';

interface State {
  username: string;
  password: string;
  loginError: string;
  loggedIn: boolean;
  authToken: string;
  profile: ProfileData | null;
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loginError: '',
      loggedIn: false,
      authToken: '',
      profile: null,
    }
  }

  componentDidMount(): void {
    const token = localStorage.getItem('authToken');
    if (token != null) {
      this.setState({ authToken: token, loggedIn: true })
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
    console.log(responseBody.token);
    localStorage.setItem('authToken', responseBody.token)
    this.setState({
       loggedIn: true,
       authToken: responseBody.token,
       username: '',
       password: '',
       loginError: '',
      })
  }

  handleLoadProfile = async () => {
    const response = await fetch('http://localhost:3000/auth/login', {
      headers: {
        'Authorization': 'Bearer ' + this.state.authToken
      }
    });
    const profileData = await response.json();
    this.setState({ profile: profileData });
  }

  handleLogout = () => {
    localStorage.removeItem('authToken');
    this.setState({
      loggedIn: false,
      authToken: '',
      profile: null,
    })
  }

  render() {
    const { username, password, loginError, loggedIn, profile } = this.state;

    if (loggedIn) {
      return <div>
        <p><button onClick={this.handleLogout}>Logout</button></p>
        <p><button onClick={this.handleLoadProfile}>Load profile data</button></p>
        <p>My profile:</p>
        <p>Username: { profile?.username }</p>
        <p>User id: { profile?.id }</p>
      </div>
    }

    return <div>
      <form onSubmit={this.handleLogin}>
        <label>
          Username:<br/>
          <input type="text" value={username} onChange={(e) => this.setState({ username: e.target.value })}/>
        </label>
        <br/>
        <label>
          Password:<br/>
          <input type="password" value={password} onChange={(e) => this.setState({ password: e.target.value })}/>
        </label>
        <br/>
        <p>{ loginError }</p>
        <input type="submit" value="Login" />
      </form>
    </div>
  }
}

export default App;
