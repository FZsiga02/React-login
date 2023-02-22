import React, { Component, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import ProfileData from './ProfileData';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';

interface State {
  authToken: string;
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);

    this.state = {
      authToken: '',
    }
  }

  render() {
    const { authToken } = this.state;
    const loggedIn = authToken != '';

    return <div>
      <LoginForm
        authToken={authToken}
        onAuthTokenChange={(token) => this.setState({ authToken: token })}
      />
      {
        loggedIn ?
          <ProfilePage authToken={authToken} /> :
          <p>Please log in</p>
      }
    </div>
  }
}

export default App;
