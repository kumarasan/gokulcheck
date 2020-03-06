import React from 'react';
import { connect } from 'react-redux';
import { ReactComponent as Menu } from '../../assets/images/optionmenu.svg';
import WebChatProfileImg from '../WebChat/WebChatProfileImg';
import { ReactComponent as ArrowBack } from '../../assets/images/arrowback.svg';
import WebChatConversationLastSeen from './WebChatConversationLastSeen'
import { ReactComponent as Search } from '../../assets/images/search.svg';
import WebChatContactInfo from '../WebChat/WebChatContactInfo';
import "../../assets/scss/common.scss";

class WebChatConversationHeader extends React.Component {

    /**
     * Following are the states used in WebChatConversationHeader Component.
     * @param {object} displayName Recent Chat data display name maintained in this state.
     * @param {object} image Recent Chat data profile image maintained in this state.
     * @param {boolean} viewContactStatus Display the contact info based on the viewContactStatus state.
     */
    constructor(props) {
        super(props);
        this.state = {
            displayName: "",
            image: "",
            jid: "",
            viewContactStatus: false,
            userstatus: ""
        }
    }

    /**
     * componentDidMount is one of the react lifecycle method. <br />
     * In this method to handle the single recent chat data.
     */
    componentDidMount() {
        this.handleSingleRecentChatData();
    }

    /**
     * componentDidUpdate is one of the react lifecycle method. <br />
     * In this method to handle the any update in single recent chat, roster and vcard contact data.
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.singleRecentChatData && prevProps.singleRecentChatData.id !== this.props.singleRecentChatData.id && this.props.singleRecentChatData && this.props.singleRecentChatData.data) {
            this.handleSetState();
        } else if (prevProps.rosterData && prevProps.rosterData.id !== this.props.rosterData.id) {
            if (this.props.rosterData && this.props.rosterData.data) {
                let localRoster = this.props.rosterData.data;
                let toUserId = this.state.jid ? this.state.jid : this.state.displayName;
                localRoster.filter((item) => {
                    let rosterId = item.jid ? item.jid : item.displayName;
                    if (rosterId === toUserId) {
                        this.setState({
                            image: item.image,
                            displayName: item.displayName,
                            userstatus: item.status
                        });
                    }
                });
            }
        }
        if (prevProps.VCardContactData && prevProps.VCardContactData.id !== this.props.VCardContactData.id) {
            if (this.state.jid === this.props.VCardContactData.data.fromuser) {
                this.setState({
                    image: this.props.VCardContactData.data.image,
                    userstatus: this.props.VCardContactData.data.userstatus
                });
            }
        }
    }

    /**
     * handleSetState() method to handle name, image, jid and status.
     */
    handleSetState = () => {
        let rosterData = this.props.singleRecentChatData.data.roster;
        this.setState({
            displayName: (rosterData.displayName) ? rosterData.displayName : (rosterData.name ? rosterData.name : rosterData.nickName),
            image: rosterData.image,
            jid: rosterData.jid,
            userstatus: rosterData.status
        });
    }

    /**
     * handleSingleRecentChatData() method to handle single recent chat data(componentDidMount).
     */
    handleSingleRecentChatData = () => {
        if (this.props.singleRecentChatData && this.props.singleRecentChatData.data) {
            this.handleSetState();
        }
    }

    /**
     * handleViewContact() method to open contact info pop up
    */
    handleViewContact = () => {
        this.setState({ viewContactStatus: true })
    }

    /**
     * handleViewContactClose() method to close contact info pop up
    */
    handleViewContactClose = () => {
        this.setState({ viewContactStatus: false })
    }

    /**
     * render() method to render the WebChatConversationHeader component into browser.
     */
    render() {

        let jid = this.props.singleRecentChatData.data.roster.jid ?
            this.props.singleRecentChatData.data.roster.jid : this.props.singleRecentChatData.data.roster.username;

        return (
            <>
                <div className="conversation-header">
                    <div className="user-profile-name" onClick={(e) => this.handleViewContact(e)}>
                        <i className="arrow-icon">
                            <ArrowBack />
                        </i>
                        <div className="profile-image">
                            <WebChatProfileImg rostersnap={this.state.image}
                                jid={jid} />
                        </div>
                        <div className="profile-name">
                            <h4>{this.state.displayName}</h4>
                            <WebChatConversationLastSeen jid={jid} />
                        </div>
                    </div>
                    <div className="profile-options">
                        <i className="search">
                                <Search/>
                            </i>
                        <i className="menu-icon">
                            <Menu />
                        </i>
                    </div>
                </div>
                {this.state.viewContactStatus &&
                    <WebChatContactInfo rosterName = {this.state.displayName}
                        rosterImage = {this.state.image}
                        jid = {jid}
                        userstatus = {this.state.userstatus}
                        onInfoClose={(e) => this.handleViewContactClose(e)} />
                }

            </>
        )
    }
}

/**
 * mapping redux data into WebChatConversationHeader component properties.
 */
const mapStateToProps = state => {
    return {
        singleRecentChatData: state.singleRecentChatData,
        VCardContactData: state.VCardContactData,
        rosterData: state.rosterData
    }
}

export default connect(mapStateToProps, null)(WebChatConversationHeader);
