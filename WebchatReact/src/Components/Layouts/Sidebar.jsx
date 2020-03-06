import React from 'react';
import { ReactComponent as NewChat } from '../../assets/images/newchat.svg';
import { ReactComponent as Menu } from '../../assets/images/optionmenu.svg';
import { ReactComponent as NewGroup } from '../../assets/images/newgroup.svg';
import { ReactComponent as Starred } from '../../assets/images/starred.svg';
import { ReactComponent as Settings } from '../../assets/images/settings.svg';
import WebChatVCard from '../WebChat/WebChatVCard';
import WebChatLogout from '../WebChat/WebChatLogout';
import WebChatPopup from '../WebChat/WebChatPopup';
import { withRouter } from "react-router";
import WebChatRoster from '../WebChat/WebChatRoster';
import WebChatRecentChat from '../WebChat/WebChatRecentChat';

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuDropDownStatus : false,
            popupStatus: false,
            newChatStatus: true,
            newChatStatusLevel: ''
        };
        this.handleMenuDrop = this.handleMenuDrop.bind(this);
        this.handleLogutStatus = this.handleLogutStatus.bind(this);
        this.handleNewChat = this.handleNewChat.bind(this);
        this.handleBackStatus = this.handleBackStatus.bind(this);
        this.handleDropdownStatus = this.handleDropdownStatus.bind(this);
    }

    handleLogutStatus(status) {
        this.setState({popupStatus:status, menuDropDownStatus: false});
    }

    handleMenuDrop() {
        this.setState({menuDropDownStatus: !this.state.menuDropDownStatus});
    }

    handleNewChat() {
        this.setState({newChatStatus: false});
    }

    handleBackStatus(status) {
        this.setState({newChatStatus: status});
    }

    handleDropdownStatus(status) {
        this.setState({menuDropDownStatus: false});
    }

    render() {
        let { menuDropDownStatus, popupStatus, newChatStatus } = this.state;        
        return(
            <>
            <div className="recent-chatlist"> 
                {newChatStatus ? <>                  
                    <div className="recent-chatlist-header">
                        <WebChatVCard />
                        <div className="profile-options">
                            <i className="newchat-icon" onClick={this.handleNewChat} title="New chat">
                                <NewChat/>
                            </i>
                            <i className="menu-icon" onClick={this.handleMenuDrop}>
                                <Menu/>                                
                            </i>
                        </div>
                        {menuDropDownStatus && <ul className="menu-dropdown">
                            <li title="New Group"><i><NewGroup/></i><span>New Group</span></li>
                            <li title="Starred"><i><Starred/></i><span>Starred</span></li>
                            <li title="Settings"><i><Settings/></i><span>Settings</span></li>
                            <WebChatLogout history={this.props.history} logoutStatus={this.handleLogutStatus} handleDropdownStatus={this.handleDropdownStatus}/>
                        </ul> }
                    </div>
                    <div className="chat-list">
                        <WebChatRecentChat />                       
                    </div>
                
                {popupStatus && <WebChatPopup history={this.props.history} logoutStatus={this.handleLogutStatus} /> }
                </>
                : <WebChatRoster handleBackStatus={this.handleBackStatus} />
                }
                </div>
            </>
        )
    }
}

export default withRouter(Sidebar);