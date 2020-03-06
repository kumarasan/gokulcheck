import React from 'react';
import WebChatProfileImg from './WebChatProfileImg';
import loaderSVG from '../../assets/images/loader.svg';
import { ReactComponent as MailIcon } from '../../assets/images/mailicon.svg'
import { connect } from 'react-redux';
import { getHighlightedText } from '../../Helpers/Utility';
import { decryption, encryption } from './WebChatEncryptDecrypt';
let localDataRoster = ''

class WebChatSearchRoster extends React.Component {

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
            searchIn: "contacts"
        }
        this.handleRosterData = this.handleRosterData.bind(this);
        this.handleEmailContacts = this.handleEmailContacts.bind(this);
        this.handleMobileContacts = this.handleMobileContacts.bind(this);
    }

    /**
     * componentDidMount() is one of the react lifecycle method. <br />
     * In this method, get the roster data from localstorage and set the data into state.
     */
    componentDidMount() {
        localDataRoster = decryption('roster_data');
        this.setState({rosterDataResponse: localDataRoster, filterItem: localDataRoster, loaderStatus: false});
    }

    /**
     * handleMobileContacts() to display the mobile contacts in new chat.
     *
     * @param {object} roster
     */
    handleMobileContacts(roster) {
        if(this.props.VCardContactData && this.props.VCardContactData.data) {
            if(this.props.VCardContactData.data.fromuser === roster.jid) {
                roster.image = this.props.VCardContactData.data.image;
                roster.status = this.props.VCardContactData.data.userstatus;
                localDataRoster.find(item => {
                    if(item.jid === roster.jid) {
                        item.image = this.props.VCardContactData.data.image;
                        item.status = this.props.VCardContactData.data.userstatus;
                        item.displayName = roster.displayName;
                    }}
                );
                encryption('roster_data', JSON.stringify(localDataRoster));
            }
        }

        return <li className="chat-list-li" key={roster.jid}>
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
                                    {this.props.searchElement !== "" ?
                                        getHighlightedText(roster.displayName, this.props.searchElement)  :
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
        if(this.props.VCardContactData && this.props.VCardContactData.data) {
            if(this.props.VCardContactData.data.fromuser === roster.username) {
                roster.image = this.props.VCardContactData.data.image;
                roster.statusMsg = this.props.VCardContactData.data.userstatus;
                localDataRoster.find(item => {
                    if(item.jid === roster.username) {
                        item.image = this.props.VCardContactData.data.image;
                        item.statusMsg = this.props.VCardContactData.data.userstatus;
                        item.name = roster.name
                    }}
                );
                encryption('roster_data', JSON.stringify(localDataRoster));
            }
        }

        return <li className="chat-list-li" key={roster.username}>
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
                                <h3 title={roster.displayName}>
                                    {this.props.searchElement !== "" ?
                                        getHighlightedText(roster.name, this.props.searchElement)  :
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
        if(prevProps.rosterData && prevProps.rosterData.id !== this.props.rosterData.id) {
            this.setState({rosterDataResponse: this.props.rosterData.data, filterItem:this.props.rosterData.data, loaderStatus: false});
        } else if(this.props.searchElement && this.props.searchElement !== prevProps.searchElement) {
            let dataValue = this.props.searchElement;
            /** Generating recent chat contacts list */
            let data = [];
            this.props.recentChatDataList.map(function(item) {
                let displayName = (item.roster.emailId) ? item.roster.name : item.roster.displayName;
                data.push(displayName);
            });
            /** Excluding recent chat conats from the roster list */
            var updatedList  = this.state.rosterDataResponse.filter(function(val) {
                let nameArray = (val.emailId) ? val.name : val.displayName;
                return data.indexOf(nameArray) === -1;
            });
            /** Filtered contacts array searching with searched keyword */
            updatedList = updatedList.filter(function (item) {
                let filterVariable = (item.emailId) ? item.name : item.displayName;
                return filterVariable.toLowerCase().search(
                    dataValue.toLowerCase()) !== -1;
            });
            (updatedList && updatedList.length > 0 ) ? this.props.handleShowContacts(true) : this.props.handleShowContacts(false)
            this.setState({filterItem :updatedList});
        }
    }

    /**
     * handleRosterData() method is perform to separate the email and mobile contacts.
     */
    handleRosterData() {
        return this.state.filterItem.map((roster) => {
            return (roster.emailId) ? this.handleEmailContacts(roster) : this.handleMobileContacts(roster)
        });
    }

    /**
     * componentWillUnmount() is one of the react lifecycle method. <br />
     *
     * In this method to unmounting the states.
     */
    componentWillUnmount() {
        this.setState({rosterDataResponse: "", loaderStatus: "", filterItem: ""});
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
            {this.props.searchElement !== "" && this.state.filterItem.length > 0 &&
                <span className="unknown-chat-roster">
                   <div className="search-head">{"Contacts"}</div>
                    <ul className="chat-list-ul">
                        {this.handleRosterData()}
                    </ul>
                </span>
            }
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

export default connect(mapStateToProps, null)(WebChatSearchRoster);
