import React from 'react';
import { ReactComponent as Camera } from '../../assets/images/camera.svg';
import { connect } from 'react-redux';
import { getHighlightedText } from '../../Helpers/Utility';

/**
 * WebChatSingleRecentChatContent Component
 * 
 * This component to handle to display the message.
 */
class WebChatSingleRecentChatContent extends React.Component {
    /**
     * handleMessage() method to display the message and sync with mobile. 
     * 
     * @param {object} response 
     */
    handleMessage(response) {
        if (this.props.messageData && this.props.messageData.data) {
            if (this.props.messageData.data.to) {
                let toUser = this.props.messageData.data.to.split("@").shift();
                if (toUser === response.roster.username || toUser === response.roster.jid) {
                    if(response.recent.msgbody.message_type === "text") {
                        response.recent.msgbody.message = this.props.messageData.data.msgbody.message;
                    }
                    return response.recent.msgbody.message;
                } else {
                    return response.recent.msgbody.message !== "" ? response.recent.msgbody.message : response.roster.status ? response.roster.status : response.roster.statusMsg;
                }
            } else if (this.props.messageData.data.from && !this.props.messageData.data.hasOwnProperty('to') && this.props.messageData.data.msgbody) {
                let fromUser = this.props.messageData.data.from.split("@").shift();
                if (fromUser === response.roster.username || fromUser === response.roster.jid) {
                    if(response.recent.msgbody.message_type === "text") {
                        response.recent.msgbody.message = this.props.messageData.data.msgbody.message;
                    }
                    return response.recent.msgbody.message;
                } else {
                    return response.recent.msgbody.message !== "" ? response.recent.msgbody.message : response.roster.status ? response.roster.status : response.roster.statusMsg;
                }
            } else {
                return response.recent.msgbody.message !== "" ? response.recent.msgbody.message : response.roster.status ? response.roster.status : response.roster.statusMsg;
            }
        } else {
            return response.recent && response.recent.msgbody && response.recent.msgbody.message !== "" ? response.recent.msgbody.message : response.roster.status ? response.roster.status : response.roster.statusMsg;
        }
    }

    /**
     * render() method to render the component into browser.
     */
    render() {
        let contactName = this.props.item.roster.displayName ? this.props.item.roster.displayName : this.props.item.roster.name;
        let lastMessage = this.handleMessage(this.props.item);
        return (
            <div className="recentchats">
                <h3 title={contactName}>
                    {this.props.searchElement  != "" ? 
                        getHighlightedText(contactName, this.props.searchElement)  :
                        contactName
                    }
                </h3>
                <span title={lastMessage}>
                    {this.props.item && this.props.item.recent && this.props.item.recent.MessageType === "video" ? <i><Camera /></i> : ''}
                    {lastMessage}
                </span>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        rosterData: state.rosterData,
        recentChatData: state.recentChatData,
        messageData: state.messageData,
        VCardContactData: state.VCardContactData
    }
}

export default connect(mapStateToProps, null)(WebChatSingleRecentChatContent);