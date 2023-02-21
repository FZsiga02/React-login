import { Component, FormEvent } from "react";

interface State {
    username: string;
    password: string;
    loginError: string;
}

interface Props {
    authToken: string;
    onAuthTokenChange: (token: string) => void;
}

export default class LoginForm extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    
        this.state = {
          username: '',
          password: '',
          loginError: '',
        }
      }

    handleLogout = () => {
        localStorage.removeItem('authToken');
        this.props.onAuthTokenChange('');
      }

      componentDidMount(): void {
        const token = localStorage.getItem('authToken');
        if (token != null) {
            this.props.onAuthTokenChange('');
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
           username: '',
           password: '',
           loginError: '',
          })
          this.props.onAuthTokenChange(responseBody.token)
      }

    render() {
        const { authToken } = this.props;
        const { username, password, loginError } = this.state;
        const loggedIn = authToken != '';
        if (loggedIn) {
            return <button onClick={this.handleLogout}>Logout</button>
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


