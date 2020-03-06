import React from 'react';
import { ls } from '../../Helpers/LocalStorage';
import { REACT_APP_API_URL } from '../processENV';
import SampleProfile from '../../assets/images/sample-profile.svg';
import { WebChatProfileImageAction } from '../../Actions/RecentChatActions';
import Store from '../../Store';
import { isUrl } from '../../Helpers/Utility';

class WebChatProfileImg extends React.Component {

    /**
     * Following the states usded in WebChatProfileImg component.
     *
     * @param {boolean} status Status of the image to display the default profile image or not.
     * @param {string} profileImg Profile image file path.
     */
    constructor(props) {
        super(props);
        this.state = {
            status: true,
            profileImg: ''
        }
        this.handleOnErrorImage = this.handleOnErrorImage.bind(this);
    }

    /**
     * componentDidMount() is one of the react lifecycle method.
     */
    componentDidMount() {
        this.handleProfileImg();
    }

    /**
     * componentDidUpdate() is one of the react lifecycle method.
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.rostersnap !== this.props.rostersnap) {
            this.handleProfileImg();
        }
    }

    /**
     * handleOnErrorImage() to handle the image not rendering properly means to display the default profile image.
     */
    handleOnErrorImage() {
        let token = ls.getItem('token');
        this.setState({ status: true });
        fetch(this.props.rostersnap).then((response) => {
            if (response.status === 401) {
                let url = new URL(this.props.rostersnap);
                url.search = `mf=${token}`;
                let imageURL = url.origin + url.pathname + url.search;
                Store.dispatch(WebChatProfileImageAction({ user: this.props.jid, image: imageURL }));
                this.setState({ profileImg: imageURL, status: false });
            }
        });
    }

    /**
     * handleProfileImg() to handle the get from profile image from API call.
     */
    handleProfileImg() {
        let token = ls.getItem('token');
        if (isUrl(this.props.rostersnap)) {
            this.setState({ profileImg: this.props.rostersnap, status: false });
        } else {
            if (this.props.rostersnap !== "" && this.props.rostersnap !== null && token !== null) {
                let responseURL = `${REACT_APP_API_URL}/chat/media/${this.props.rostersnap}?mf=${token}`;
                Store.dispatch(WebChatProfileImageAction({ user: this.props.jid, image: responseURL }));
                this.setState({ profileImg: responseURL, status: false });
            } else {
                this.setState({ status: true });
                //Store.dispatch(WebChatProfileImageAction({ user: this.props.jid, image: "" }));
            }
        }
    }

    /**
     * componentWillUnmount() is one of the react lifecycle method.
     *
     * This method to handle the unmounting states.
     */
    componentWillUnmount() {
        this.setState({ profileImg: '', status: '' });
    }

    /**
     * render() method is render the component into browser.
     */
    render() {

        if (this.state.status) {
            return <img src={SampleProfile} alt="profile-snapshot" />
        }

        return (
            <><img src={this.state.profileImg} className="img-placeholder" alt="vcard-snap" onError={this.handleOnErrorImage} /></>
        )
    }
}
export default WebChatProfileImg;
