import React from 'react';
import WebChatProfileImg from './WebChatProfileImg';
import loaderSVG from '../../assets/images/loader.svg';
import { ReactComponent as MailIcon } from '../../assets/images/mailicon.svg'
import { ReactComponent as ArrowBack } from '../../assets/images/arrowback.svg';
import { ReactComponent as EmptyContact } from '../../assets/images/nocontact.svg';
import { connect } from 'react-redux';
import { getHighlightedText } from '../../Helpers/Utility';
import { decryption, encryption } from './WebChatEncryptDecrypt';
import WebChatSearch from "./WebChatSearch";
import Store from '../../Store';
import { SingleRecentChatAction } from '../../Actions/RecentChatActions';
import { NO_SEARCH_CONTACT_FOUND } from '../processENV';

let localDataRoster = ''

class WebChatRoster extends React.Component {

    /**
     * Following the states used in WebChatRoster Component.
     *
     * @param {boolean} loaderStatus Display the loader based on the loaderStatus state.
     * @param {object} rosterDataResponse Manage the roster data in this state.
     * @param {array} filterItem Manage the search items in this state.
     */
    constructor(props) {
        super(props);
        this.state = {
            loaderStatus: true,
            rosterDataResponse: "",
            filterItem: [],
            searchIn: "contacts",
            searchWith: ""
        }
        this.handleRosterData = this.handleRosterData.bind(this);
        this.handleEmailContacts = this.handleEmailContacts.bind(this);
        this.handleMobileContacts = this.handleMobileContacts.bind(this);
        this.handleNewChatStatus = this.handleNewChatStatus.bind(this);
        this.handleOnBack = this.handleOnBack.bind(this);
        this.handleFilterContactsList = this.handleFilterContactsList.bind(this);
    }

    /**
     * componentDidMount() is one of the react lifecycle method. <br />
     * In this method, get the roster data from localstorage and set the data into state.
     */
    componentDidMount() {
        localDataRoster = decryption('roster_data');
        this.setState({ rosterDataResponse: localDataRoster, filterItem: localDataRoster, loaderStatus: false });
    }

    /**
     * handleNewChatStatus() method to manage the new chat icon click status.
     */
    handleNewChatStatus() {
        this.setState({ newChatStatus: true });
    }

    /**
     * handleOnBack() method to manage the back to recent chat icon click status.
     */
    handleOnBack() {
        this.props.handleBackStatus(true);
    }

    handleRoster = (event, response) => {
        let data = {
            roster: response
        }
        Store.dispatch(SingleRecentChatAction(data));
        this.props.handleBackStatus(true);
    }

    /**
     * handleMobileContacts() to display the mobile contacts in new chat.
     *
     * @param {object} roster
     */
    handleMobileContacts(roster) {
        if (this.props.VCardContactData && this.props.VCardContactData.data) {
            if (this.props.VCardContactData.data.fromuser === roster.jid) {
                roster.image = this.props.VCardContactData.data.image;
                roster.status = this.props.VCardContactData.data.userstatus;
                localDataRoster.find(item => {
                    if (item.jid === roster.jid) {
                        item.image = this.props.VCardContactData.data.image;
                        item.status = this.props.VCardContactData.data.userstatus;
                        item.displayName = roster.displayName;
                    }
                    return item;
                }
                );
                encryption('roster_data', localDataRoster);
            }
        }

        return <li className="chat-list-li" key={roster.jid} onClick={(e) => this.handleRoster(e, roster)}>
            <div className="profile-image">
                <div className="image">
                    <WebChatProfileImg rostersnap={roster.image} jid={roster.jid} />
                </div>
            </div>
            <div className="recentchats">
                <div className="recent-username-block">
                    <div className="recent-username">
                        <span className="username">
                            <h3 title={roster.displayName}>
                                {this.state.searchWith !== "" ?
                                    getHighlightedText(roster.displayName, this.state.searchWith) :
                                    roster.displayName
                                }
                            </h3>
                        </span>
                    </div>
                </div>
                <div className="recent-message-block">
                    <span title={roster.status}>
                        {roster.status}
                    </span>
                </div>
            </div>
        </li>
    }

    /**
     * handleEmailContacts() method to display the email contacts in new chat.
     * @param {object} roster
     */
    handleEmailContacts(roster) {
        if (this.props.VCardContactData && this.props.VCardContactData.data) {
            if (this.props.VCardContactData.data.fromuser === roster.username) {
                roster.image = this.props.VCardContactData.data.image;
                roster.statusMsg = this.props.VCardContactData.data.userstatus;
                localDataRoster.find(item => {
                    if (item.jid === roster.username) {
                        item.image = this.props.VCardContactData.data.image;
                        item.statusMsg = this.props.VCardContactData.data.userstatus;
                        item.name = roster.name
                    }
                    return item;
                }
                );
                encryption('roster_data', localDataRoster);
            }
        }

        return <li className="chat-list-li" key={roster.username} onClick={(e) => this.handleRoster(e, roster)}>
            <div className="profile-image">
                <div className="image">
                    <WebChatProfileImg rostersnap={roster.image} jid={roster.username} />
                </div>
                <i>
                    <MailIcon />
                </i>
            </div>
            <div className="recentchats">
                <div className="recent-username-block">
                    <div className="recent-username">
                        <span className="username">
                            <h3 title={roster.name}>
                                {this.state.searchWith != "" ?
                                    getHighlightedText(roster.name, this.state.searchWith) :
                                    roster.name
                                }
                            </h3>
                        </span>
                    </div>
                </div>
                <div className="recent-message-block">
                    <span title={roster.statusMsg}>
                        {roster.statusMsg}
                    </span>
                </div>
            </div>
        </li>
    }

    /**
     * componentDidUpdate() is one of the react lifecycle method. <br />
     * In this method, to updated the upcoming rosters into state.
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.rosterData && prevProps.rosterData.id !== this.props.rosterData.id) {
            this.setState({ rosterDataResponse: this.props.rosterData.data, filterItem: this.props.rosterData.data, loaderStatus: false });
        }
    }

    /**
     * handleRosterData() method is perform to separate the email and mobile contacts.
     */
    handleRosterData() {
        if (this.state.filterItem.length > 0) {
            return this.state.filterItem.map((roster) => {
                return (roster.emailId) ? this.handleEmailContacts(roster) : this.handleMobileContacts(roster)
            });
        } else if (this.state.filterItem.length === 0 && this.state.searchWith !== "") {
            return <div className="no-search-record-found">{NO_SEARCH_CONTACT_FOUND}</div>
        } else {
            return <>
                <div className="norecent-chat">
                    <i className="norecent-chat-img">
                        <EmptyContact />
                    </i>
                    <h4>{"It seems like there are no contacts"}</h4>
                </div>
            </>
        }
    }





    /**
     * componentWillUnmount() is one of the react lifecycle method. <br />
     *
     * In this method to unmounting the states.
     */
    componentWillUnmount() {
        this.setState({ rosterDataResponse: "", loaderStatus: "", filterItem: ""});
    }

    /**
     * handleFilterContactsList() method is to handle the searched contacts from list
     *
     * @param {object} filterData
     * @param {string} searchWith
     */
    handleFilterContactsList(filterData, searchWith) {
        this.setState({ filterItem: filterData, searchWith: searchWith });
    }

    render() {
        const loaderStyle = {
            width: 50,
            height: 50
        }

        if (this.state.loaderStatus) {
            return <img src={loaderSVG} alt="loader" style={loaderStyle} />
        }

        return (
            <>
                <div className="contactlist">
                    <div className="recent-chatlist-header">
                        <div className="profile-img-name">
                            <i className="newchat-icon" onClick={this.handleOnBack}>
                                <ArrowBack />
                            </i>
                            <span>{"New chat"}</span>
                        </div>
                    </div>
                    <WebChatSearch searchIn={this.state.searchIn} rosterDataResponse={this.state.rosterDataResponse} handleSearchFilterList={this.handleFilterContactsList} />
                    <ul className="chat-list-ul">
                        {this.handleRosterData()}
                    </ul>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state, props) => {
    return ({
        rosterData: state.rosterData,
        vCardData: state.vCardData.data,
        VCardContactData: state.VCardContactData,
    });
};

export default connect(mapStateToProps, null)(WebChatRoster);
