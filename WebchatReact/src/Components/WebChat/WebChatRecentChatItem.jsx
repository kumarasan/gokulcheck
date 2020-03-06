import React from 'react';
import WebChatProfileImg from './WebChatProfileImg';
import { ReactComponent as MailIcon } from '../../assets/images/mailicon.svg';
import SingleChatAvatarImg from '../../assets/images/sample-profile.svg';
import GroupChatAvatarImg from '../../assets/images/sample-group-profile.svg';
import { connect } from 'react-redux';

class WebChatRecentChatItem extends React.Component {
    /**
     * Following the states used in WebChatRecentChatItem Component.
     *
     * @param {string} image To display the profile image.
     */
    constructor(props) {
        super(props);
        this.state = {
            image: ""
        }
    }

    /**
     * componentDidMount() method is one of the react lifecycle method.
     */
    componentDidMount() {
        if (this.props.item && this.props.item.roster && this.props.item.roster.image !== "" && this.props.item.roster.image !== null) {
            this.setState({ image: this.props.item.roster.image });
        } else {
            this.setState({ image: "" });
        }
    }

    /**
     * componentDidUpdate() method is one of the react lifecycle method.
     *
     * Update the profile image set into state.
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.VCardContactData && prevProps.VCardContactData.id !== this.props.VCardContactData.id) {
            let jid = this.props.item.roster.jid ? this.props.item.roster.jid : this.props.item.roster.username;
            if (this.props.VCardContactData.data.fromuser === jid) {
                this.setState({ image: this.props.VCardContactData.data.image });
            }
        } else if (prevProps.item !== this.props.item && this.props.item && this.props.item.roster.image) {
            this.setState({ image: this.props.item.roster.image });
        }
    }

    /**
     * render() method to render the component into browser.
     */
    render() {
        let avatarIcon = (this.props.item.recent.chattype === "chat") ? SingleChatAvatarImg : GroupChatAvatarImg;
        if(this.props.item.roster.image === "" || this.props.item.roster.image === null) {
            return <div className="profile-image">
            <div className="image"><img src={avatarIcon} alt="vcard-snap" /></div></div>
        }

        return (
            <>
                <div className="profile-image">
                    <div className="image">
                        {(this.state.image !== "" && this.state.image !== null && this.state.image !== undefined) ?
                            <WebChatProfileImg rostersnap={this.state.image}
                                jid={(this.props.item.roster.jid) ? this.props.item.roster.jid : this.props.item.roster.username} />
                            :
                            <img src={avatarIcon} alt="vcard-snap" />
                        }
                    </div>
                    {this.props.item.roster.emailId && <i>
                        <MailIcon />
                    </i>}

                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        VCardContactData: state.VCardContactData
    }
}

export default connect(mapStateToProps, null)(WebChatRecentChatItem);
