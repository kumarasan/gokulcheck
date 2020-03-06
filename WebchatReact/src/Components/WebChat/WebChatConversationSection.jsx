import React from 'react';
import { connect } from 'react-redux';
import ChatBanner from '../../assets/images/index-chat-banner.png';
import WebChatConversationHeader from './WebChatConversationHeader';
import WebChatConversationHistory from './WebChatConversationHistory';
import "../../assets/scss/common.scss";

class WebChatConversationSection extends React.Component {

    /**
     * render() method to render the WebChatConversationSection component into browser.
    */
    render() {
        if (this.props.singleRecentChatData && this.props.singleRecentChatData.length === 0) {
            return (<div className="chat-banner">
                <div className="banner-block">
                    <img src={ChatBanner} alt="chant-banner" />
                    <h4>{"Start a conversation!"}</h4>
                </div>
            </div>);
        }

        return (
            <>
                <div className="chat-conversion">
                    <WebChatConversationHeader />
                    <WebChatConversationHistory />
                </div>
            </>
        )
    }
}

/**
 * mapping redux data into WebChatConversationSection component properties.
 */
const mapStateToProps = state => {
    return {
        singleRecentChatData: state.singleRecentChatData
    }
}

export default connect(mapStateToProps, null)(WebChatConversationSection);
