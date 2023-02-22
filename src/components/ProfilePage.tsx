import { Component, ReactNode } from "react";
import ProfileData from "../ProfileData";

interface Props {
    authToken: string;
}

interface State {
    profile: ProfileData | null;
}

export default class ProfilePage extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            profile: null,
        }
    }

    componentDidMount(): void {
        this.handleLoadProfile();
    }

    handleLoadProfile = async () => {
        const response = await fetch('http://localhost:3000/profile', {
            headers: {
                'Authorization': 'Bearer ' + this.props.authToken
            }
        });
        const profileData = await response.json();
        this.setState({ profile: profileData });
    }

    render() {
        const { profile } = this.state;

        return <div>
            <p>My profile:</p>
            <p>Username: {profile?.username}</p>
            <p>User id: {profile?.id}</p>
        </div>
    }
}
