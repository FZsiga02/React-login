import React, { Component, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import ProfileData from './ProfileData';
import LoginForm from './components/LoginForm';

interface State {
  authToken: string;
  profile: ProfileData | null;
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);

    this.state = {
      authToken: '',
      profile: null,
    }
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

  

  render() {
    const { authToken, profile } = this.state;
    const loggedIn = authToken != '';

    return <div>
      <LoginForm 
      authToken={authToken}
      onAuthTokenChange={(token) => this.setState({ authToken: token })}
      />
      {
        loggedIn ?
        <div>
          <p><button onClick={this.handleLoadProfile}>Load profile data</button></p>
          <p>My profile:</p>
          <p>Username: { profile?.username }</p>
          <p>User id: { profile?.id }</p>
        </div> : 
        <p>Please log in</p>
      }
    </div>
  }
}

export default App;
