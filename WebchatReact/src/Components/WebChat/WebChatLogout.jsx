import React from 'react';
import ReactDOM from 'react-dom';
import { ReactComponent as Logout } from '../../assets/images/logout.svg';

class WebChatLogut extends React.Component {

    /**
     * WebChatLogout Component
     * 
     * The following states used in WebChatLogout.
     * 
     * @param {boolean} logoutPopupStatus Logout popup window status.     * 
     * 
     * @param {object} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            logoutPopupStatus: false
        }
        this.handleLogoutStatus = this.handleLogoutStatus.bind(this);
    }

    /**
     * componentDidMount() is one of the react lifecycle method. <br />
     * This method to addEventListener the onclick event.
     */
    componentDidMount() {
        document.addEventListener('click', this.handleLogoutStatus, true);
    }

    /**
     * componentWillUnmount() is one of the react lifecycle method. <br />
     * This method to removeEventListener the onclick event.
     */
    componentWillUnmount() {
        document.removeEventListener('click', this.handleLogoutStatus, true);
    }

    /**
     * To click the logout button to trigger the handleLogoutStatus() method.
     * 
     * @param {object} event 
     */
    handleLogoutStatus(event) {
        this.handleClickOutside(event);
    }

    /**
     * To check the outside DOM click or not in web app. <br />
     * Based on click event to display the dropdown lists or logout button click event
     */
    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.handleDropdownStatus(false);
        } else {
            this.props.logoutStatus(true);
        }
    }

    /**
     * To render the component into brower.
     */
    render() {
        return (
            <>
                <li onClick={this.handleLogoutStatus} className="webchat-logout" title="Logout"><i><Logout /></i><span>Logout</span></li>
            </>
        )
    }

}

export default WebChatLogut;
