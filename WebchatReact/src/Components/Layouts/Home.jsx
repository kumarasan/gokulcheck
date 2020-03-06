import React from 'react';
import "../../assets/scss/common.scss";
import { connect } from 'react-redux';
import { ReactComponent as Menu } from '../../assets/images/optionmenu.svg';
import WebChatProfileImg from '../WebChat/WebChatProfileImg';
import ChatBanner from '../../assets/images/index-chat-banner.png';
import { ReactComponent as Blocked } from '../../assets/images/blocked.svg';
import { ReactComponent as Delete } from '../../assets/images/delete.svg';
import { ReactComponent as Call } from '../../assets/images/call.svg';
import { ReactComponent as Next } from '../../assets/images/next.svg';

import profileimage from '../../assets/images/sarah.png';
import { ReactComponent as NewChat } from '../../assets/images/newchat.svg';
import { ReactComponent as Close } from '../../assets/images/close.svg';
import { ReactComponent as EditCamera } from '../../assets/images/editcamera.svg';
import { ReactComponent as Edit } from '../../assets/images/edit.svg';
import { ReactComponent as Status } from '../../assets/images/status.svg';
import { ReactComponent as Info } from '../../assets/images/info.svg';
import { ReactComponent as ArrowBack } from '../../assets/images/arrowback.svg';
import { ReactComponent as Nochat } from '../../assets/images/nochat.svg';
import { ReactComponent as Search } from '../../assets/images/search.svg';
import WebChatContactInfo from '../WebChat/WebChatContactInfo';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vCard: '',
            displayName: '',
            image: '',
            contactInfoStatus: false
        }
        this.handleContactInfo = this.handleContactInfo.bind(this);
        this.handleContactInfoClose = this.handleContactInfoClose.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.singleRecentChatData && prevProps.singleRecentChatData.id !== this.props.singleRecentChatData.id) {
            if (this.props.singleRecentChatData && this.props.singleRecentChatData.data) {
                this.setState({
                    displayName: (this.props.singleRecentChatData.data.roster.displayName) ? this.props.singleRecentChatData.data.roster.displayName : this.props.singleRecentChatData.data.roster.name,
                    image: this.props.singleRecentChatData.data.roster.image
                });
            }            
        }
    }

    handleContactInfo() {
        this.setState({contactInfoStatus: true});
    }

    handleContactInfoClose() {
        this.setState({contactInfoStatus: false});
    }

    render() {

        let { contactInfoStatus } = this.state;

        if (this.props.singleRecentChatData.length === 0) {
            return <div className="chat-banner">
                <div className="banner-block">
                    <img src={ChatBanner} alt="chat-banner" />
                    <h4>Start a conversation</h4>
                </div>
                
            </div>
        }

        return (

            <>
                {/* <div className="chat-conversion">
                    <div className="conversation-header">
                        <div className="user-profile-name">
                            <div className="profile-image">
                                <WebChatProfileImg rostersnap={this.state.image}/>
                            </div>
                            <div className="profile-name">
                                <h4>{this.state.displayName}</h4>
                                <h6>Online</h6>
                            </div>
                        </div>

                        <div className="profile-options">
                            <i className="menu-icon">
                                <Menu />
                            </i>
                        </div>
                    </div>
                </div> */}
                 <div className="chat-conversion">                    
                    <div className="conversation-header">
                        <div className="user-profile-name" onClick={this.handleContactInfo}>
                            <i className="arrow-icon">
                                <ArrowBack/>
                            </i>
                            <div className="profile-image">
                                <img src={profileimage} alt=""/>
                            </div>
                            <div className="profile-name">
                                <h4>{this.state.displayName}</h4>
                                <h6>Online</h6>
                            </div>
                        </div>                        
                        <div className="profile-options">
                            <i className="search">
                                <Search/>                                
                            </i>
                            <i className="menu-icon">
                                <Menu/>                                
                            </i>
                        </div>
                    </div>
                    <div className="chatconversation-container">
                        <span className="chatday">Today</span>
                        {/* <div className="textmessage-block">
                            <div className="send-message">
                                <div className="send-message-block">
                                    <span className="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec idan Testing</span>
                                    <span className="message-time">10:10 PM</span>
                                </div>
                            </div>                            
                        </div> */}
                        {/* <div className="textmessage-block">
                            <div className="receive-message">
                                <div className="receive-message-block">
                                    <span className="message">Hey Sarah! how are you?</span>
                                    <span className="message-time">10:10 PM</span>
                                </div>
                            </div>                            
                        </div> */}
                    </div>
                    {contactInfoStatus && <div className="contactinfo-popup">
                    <div className="contactinfo">
                        <div className="contactinfo-header">
                            <i onClick={this.handleContactInfoClose}>
                                <Close/>
                            </i>
                            <h4>Contact info</h4>
                        </div>
                        <div class="contactinfo-image-block">
                            <div className="profile-image">                            
                                <img src={profileimage} alt=""/>                            
                            </div>
                            <span>Laney Gray </span>
                        </div>
                        <div className="contactinfo-about-no">
                            <h5>About and phone number</h5>
                            <div className="about-no">
                                <i>
                                    <Status/>
                                </i>
                                <span>I am in mirrorfly</span>
                            </div>
                            <div className="about-no">
                                <i>
                                     <Call/> 
                                </i>
                                <span>+91 8945761243</span>
                            </div>
                        </div>
                        <div className="contactinfo-media">
                            <h5>
                                <span className="media">Media and Docs</span>
                                <span className="count">5 <i><Next/></i></span>
                            </h5>
                        </div>
                        <div className="contactinfo-about-no">
                            <div className="about-no">
                                <i>
                                   <Blocked/>
                                </i>
                                <span>Block Contact</span>
                            </div>
                            <div className="about-no">
                                <i>
                                    <Delete/>
                                </i>
                                <span className="delete">Delete</span>
                            </div>
                        </div>
                    </div>
                    </div> }
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        singleRecentChatData: state.singleRecentChatData,
        WebChatProfileImageData: state.WebChatProfileImageData
    }
}

export default connect(mapStateToProps, null)(Home);
