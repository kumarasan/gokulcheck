import React from 'react';
import { connect } from 'react-redux';
import SDK from '../SDK';
import { REACT_APP_XMPP_SOCKET_HOST } from '../processENV'
import { getLastseen } from './WebChatTimeStamp';
import "../../assets/scss/common.scss";

class WebChatConversationLastSeen extends React.Component {
    /**
     * Following are the states used in WebChatConversationLastSeen Component.
     * @param {object} lastSeen last actvity of user.
     * 
     */
    constructor(props) {
        super(props);
        this.state = {
            lastSeen: ""
        }
    }

    /**
     * componentDidMount is one of the react lifecycle method. <br />
     * 
     * In this method to handle the last activity of a contact.
     */
    componentDidMount() {
        if(this.props.jid){
            SDK.getLastActivity(this.props.jid + '@' + REACT_APP_XMPP_SOCKET_HOST)
            if(this.props.lastActivity && this.props.lastActivity.data && this.props.lastActivity.data.seconds){
                this.handleGetLastSeen();
            }
        }
    }

    /**
     * componentDidUpdate is one of the react lifecycle method. <br />
     * 
     * In this method to handle the last activity of a contact.
     * 
     * @param {object} prevProps 
     * @param {object} prevState 
     */
    componentDidUpdate(prevProps, prevState) {        
        if(prevProps.lastActivity && this.props.lastActivity && prevProps.lastActivity.id !== this.props.lastActivity.id){
            if(this.props.lastActivity.data && this.props.lastActivity.data.seconds){
                SDK.getLastActivity(this.props.jid + '@' + REACT_APP_XMPP_SOCKET_HOST)
                this.handleGetLastSeen();
            }
        }
    }

    /**
     * handleGetLastSeen() method to handle profile last seen time.
     */
    handleGetLastSeen = () => {
        let seconds = getLastseen(this.props.lastActivity.data.seconds);
        this.setState({
            lastSeen: seconds
        });
    }

    /**
     * render() method to render the WebChatConversationLastSeen component into browser.
     */
    render() {
        return (
            <>
                <h6>{this.state.lastSeen}</h6>
            </>
        )
    }
}

/**
 * mapping redux data into WebChatConversationLastSeen component properties.
 */
const mapStateToProps = state => {
    return {
        lastActivity: state.lastActivityData
    }
}

export default connect(mapStateToProps, null)(WebChatConversationLastSeen);
