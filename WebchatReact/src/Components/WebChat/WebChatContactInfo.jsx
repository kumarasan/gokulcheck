import React from 'react';
import { connect } from 'react-redux';
import { REACT_APP_XMPP_SOCKET_HOST, 
         BLOCK_CONTACT, 
         UNBLOCK_CONTACT,
         MEDIA_AND_DOCS } from '../processENV';
import OutsideClickHandler from 'react-outside-click-handler';
import WebChatProfileImg from './WebChatProfileImg';
import { ReactComponent as Status } from '../../assets/images/status.svg';
import { ReactComponent as Blocked } from '../../assets/images/blocked.svg';
import { ReactComponent as Delete } from '../../assets/images/delete.svg';
import { ReactComponent as Call } from '../../assets/images/call.svg';
import { ReactComponent as Next } from '../../assets/images/next.svg';
import SampleImg from '../../assets/images/sample-profile.svg';
import { ReactComponent as Close } from '../../assets/images/close.svg';
import "../../assets/scss/common.scss";

class WebChatContactInfo extends React.Component {

    /**
     * Following are the states used in WebChatContactInfo Component.
     * @param {object} displayName contact's name.
     * @param {object} image contact's profile.
     * @param {boolean} status contact's user status.
     * @param {boolean} jid contact's mobile number.
     * @param {boolean} isBlocked contact's blocked/unblocked status.
     */
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            image: '',
            status: '',
            jid: '',
            isBlocked: BLOCK_CONTACT,
            showContactProfileImg: false
        }        
    }

    /**
     * componentDidMount is one of the react lifecycle method. <br />
     * 
     * In this method to handle the block user data.
     */
    componentDidMount() {
        if (this.props.BlockData) {
            this.handleBlockUserData();
        }
    }

    /**
     * handleBlockUserData() method used to display contacts blocked/unblocked status.
     */
    handleBlockUserData = () => {
        let isBlockedArray = this.props.BlockData.data;
        let toSearch = this.props.singleRecentChatData.data.roster.jid + "@" + REACT_APP_XMPP_SOCKET_HOST
        let matches = isBlockedArray.filter(v => v.jid.toLowerCase().includes(toSearch));
        (matches.length !== 0) ? this.setState({ isBlocked: UNBLOCK_CONTACT }) : this.setState({ isBlocked: BLOCK_CONTACT });
    }

    /**
     * componentDidUpdate is one of the react lifecycle method. <br />
     * 
     * In this method to handle the block user data.
     * 
     * @param {object} prevProps 
     * @param {object} prevState 
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.BlockData && this.props.BlockData && prevProps.BlockData.id !== this.props.BlockData.id) {
            this.handleBlockUserData();
        }      
    }

    /**
     * handleProfileImageShow() method to maintain state to show profile image in big screen.
     */
    handleContactInfoImgShow = (e) => {
        this.setState({ showContactProfileImg: true });
    }

    /**
     * handleProfileImgClose() method to maintain state to close profile image.
     */
    handleContactInfoImgClose = (e) => {
        this.setState({ showContactProfileImg: false });
    }

    render() {
        return (
            <>
                <div className="contactinfo-popup">
                    <div className="contactinfo">
                        <OutsideClickHandler onOutsideClick={this.props.onInfoClose} >
                            <div className="contactinfo-header">
                                <i onClick={this.props.onInfoClose} >
                                    <Close />
                                </i>
                                <h4>{"Contact info"}</h4>
                            </div>
                            <div className="contactinfo-image-block">
                                <div className="profile-image" onClick={(e) => this.handleContactInfoImgShow(e)}>
                                    {(this.props.rosterImage !== "" && this.props.rosterImage !== null && this.props.rosterImage !== undefined) ?
                                        <WebChatProfileImg rostersnap={this.props.rosterImage}
                                            jid={this.props.jid} />
                                        :
                                        <img src={SampleImg} alt="vcard-snap" />
                                    }
                                </div>
                                {this.state.showContactProfileImg && <div className="Viewphoto-container">
                                    <div className="Viewphoto-preview">
                                        <WebChatProfileImg rostersnap={this.props.rosterImage} jid={this.props.jid} />
                                        <i className="preview-close" onClick={(e) => this.handleContactInfoImgClose(e)}><Close /></i>
                                    </div>
                                </div>} 
                                <span>{this.props.rosterName} </span>
                            </div>
                            <div className="contactinfo-about-no">
                                <h5>{"About and phone number"}</h5>
                                <div className="about-no">
                                    <i>
                                        <Status />
                                    </i>
                                    <span>{this.props.userstatus}</span>
                                </div>
                                <div className="about-no">
                                    <i>
                                        <Call />
                                    </i>
                                    <span>{this.props.jid}</span>
                                </div>
                            </div>
                            <div className="contactinfo-media">
                                <h5>
                                    <span className="media">{ MEDIA_AND_DOCS }</span>
                                    <span className="count">{"5"}<i><Next/></i></span>
                                </h5>
                            </div>
                            <div className="contactinfo-about-no">
                                <div className="about-no">
                                    <i>
                                        <Blocked />
                                    </i>
                                    <span>{this.state.isBlocked}</span>
                                </div>
                                <div className="about-no">
                                    <i>
                                        <Delete />
                                    </i>
                                    <span className="delete">{"Delete Chat"}</span>
                                </div>
                            </div>
                        </OutsideClickHandler>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        singleRecentChatData: state.singleRecentChatData,
        rosterData: state.rosterData,
        BlockData: state.BlockData,
        VCardContactData: state.VCardContactData
    }
}

export default connect(mapStateToProps, null)(WebChatContactInfo);
