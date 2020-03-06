import React from 'react';
import SDK from '../SDK';
import { ls } from '../../Helpers/LocalStorage';

class WebChatPopup extends React.Component {

    /**
     * WebChatPopup Component.
     * 
     * @param {object} props 
     */
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogoutCancel = this.handleLogoutCancel.bind(this);
    }

    /**
     * handleLogout() Method to call the SDK.logout() and removed the localstorage values. <br />
     * Window.location.reload() function performed.
     */
    handleLogout() {
        let items = ["auth_user", "blocklist_data", "favouritemsglist_data", "vcard_data", "connection_status", 
                     "roster_data", "presence_data", "groupslist_data", "token", "recentchat_data", "new_recent_chat_data"];
        for (let item of items) {
            ls.removeItem(item);
        }
        SDK.logout();
        window.location.reload();
    }

    /**
     * handleLogoutCancel() Method to perform cancel the logout option.
     */
    handleLogoutCancel() {
        this.props.logoutStatus(false);
    }

    /**
     * render() method to render the WebChatPopup component render into browser.
     */
    render() {
        return <div className="userprofile logout">
            <div className="logout-popup">
                <div className="logout-label">
                    <label>{"Are you sure you want to logout?"}</label>
                </div>
                <div className="logout-noteinfo">
                    <button type="button" className="btn-cancel" name="btn-cancel" onClick={this.handleLogoutCancel}>{"Cancel"}</button>
                    <button type="button" className="btn-logout" name="btn-logout" onClick={this.handleLogout}>{"Logout"}</button>
                </div>
            </div>
        </div>
    }
}

export default WebChatPopup;
