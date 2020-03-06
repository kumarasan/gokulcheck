import React from 'react';
import { connect } from 'react-redux';
import Store from '../../Store';
import { formatChatDateTime, convertUTCTOLocalTimeStamp } from './WebChatTimeStamp';
import { SingleRecentChatAction } from '../../Actions/RecentChatActions';
import WebChatRecentChatItem from './WebChatRecentChatItem';
import { recentChatCompare, getHighlightedText } from '../../Helpers/Utility';
import { decryption, encryption } from './WebChatEncryptDecrypt';
import WebChatSearch from './WebChatSearch';
import WebChatSearchRoster from "./WebChatSearchRoster";
import { ReactComponent as Rechatchatimage } from '../../assets/images/emptychat.svg';
import { ReactComponent as Nochat } from '../../assets/images/nochat.svg';
import { ReactComponent as Camera } from '../../assets/images/camera.svg';
import { ReactComponent as Video } from '../../assets/images/video.svg';
import { ReactComponent as Audio } from '../../assets/images/audio.svg';
import { ReactComponent as Document } from '../../assets/images/document.svg';
import { ReactComponent as Search } from '../../assets/images/search.svg';
import loaderSVG from '../../assets/images/loader.svg';
import {
    REACT_APP_XMPP_SOCKET_HOST,
    NO_RECENT_CHAT_INFO,
    NO_RECENT_CLICK_ON_INFO,
    NO_RECENT_SEARCH_CONTACTS_INFO,
    NO_SEARCH_CHAT_CONTACT_FOUND
} from "../processENV";
import SDK from '../SDK';

class WebChatRecentChat extends React.Component {

    /**
     * Following the states used in WebChatRecentChat Component.
     * @param {object} recentChat Recent Chat data maintained in this state.
     * @param {boolean} loaderStatus Display the loader based on the loaderStatus state.
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            recentChat: "",
            loaderStatus: true,
            latestTime: "",
            rosterDataState: "",
            filterItem: "",
            searchIn: "recent-chat",
            searchElement: "",
            isShowContacts: false
        }
        this.handleSingleRecentChat = this.handleSingleRecentChat.bind(this);
        this.handleSearchFilterList = this.handleSearchFilterList.bind(this);
    }

    /**
     * componentDidMount is one of the react lifecycle method. <br />
     *
     * In this method to handle the recent chat data and to check with roster data.
     */
    componentDidMount() {
        let data = [];
        let recentRoster = [];
        if (this.props.rosterData.length === 0 && this.props.recentChatData.length === 0) {
            this.setState({ loaderStatus: true });
        } else {
            if (localStorage.getItem('roster_data') !== null && localStorage.getItem('recentchat_data') !== null) {
                let localRoster = decryption('roster_data');
                let localRecent = decryption('recentchat_data');
                if (localStorage.getItem("new_recent_chat_data") !== null) {
                    let newRecentChatData = decryption("new_recent_chat_data");
                    newRecentChatData.forEach((element, index) => {
                        let toUserId = element.roster.username ? element.roster.username : element.roster.jid;
                        localRoster.filter((item) => {
                            let rosterId = item.username ? item.username : item.jid;
                            if (rosterId === toUserId) {
                                newRecentChatData[index].roster = item;
                            }
                            return newRecentChatData;
                        });
                    })
                    this.setState({ recentChat: newRecentChatData, filterItem: newRecentChatData, loaderStatus: false });
                } else {
                    if (this.props.rosterData.data && localRecent !== null) {
                        localRecent.map((recent) => {
                            localRoster && localRoster.map((roster) => {
                                let rosterJid = (roster.username) ? roster.username : roster.jid;
                                if (recent.msgfrom === rosterJid) {
                                    data.push({
                                        recent: recent,
                                        roster: roster
                                    });
                                    recentRoster.push(rosterJid);
                                }
                            });
                            if(recent.chattype === "normal") {
                                this.props.groupsData.data.groups.map((groups) => {
                                    if (recent.msgfrom === groups.jid) {
                                        data.push({
                                            recent: recent,
                                            roster: groups
                                        });
                                    }
                                });
                            } else if (!recentRoster.includes(recent.msgfrom) && recent.chattype === "chat") {
                                    data.push({
                                        recent: recent,
                                        roster: ""
                                    });
                            }
                        });
                        let result = data.sort(recentChatCompare);
                        this.setState({ recentChat: result.reverse(), filterItem: result, loaderStatus: false });
                    }
                }
            }
        }
    }

    /**
     * handleReorder method to handle reorder the to chat.
     */
    handleReorder = async (finalData, toUser, msgFrom, messageType, messageData) => {
        let filterData = finalData.filter(ele => {
            if (ele.recent.msgfrom === toUser) {
                ele.recent.publisher = msgFrom;
                ele.recent.msgid = messageData.data.msgid;
                ele.recent.MessageType = messageType;
                ele.recent.msgbody = this.handleRecentChatMessageType(messageType, messageData);
                return ele;
            }
        });
        let remain = finalData.map(ele => {
            if (ele.recent.msgfrom !== toUser) {
                return ele;
            }
        }).filter(ele => ele)
        return await filterData.concat(remain);
    }

    /**
     * handleNewRecentChat method to handle the new chat in recent chat section.
     */
    handleNewRecentChat = (messageData) => {
        let finalData = this.state.filterItem;
        let recentChatFrom = [];
        let recentChatTo = [];
        finalData.map((recent) => {
            recentChatFrom.push(recent.recent.msgfrom);
            recentChatTo.push(recent.recent.msgto);
        });
        let newChatFrom = this.handleSplitUserId(messageData.from);
        if(messageData.messageType === "carbonSentMessage" || messageData.messageType === "carbonReceiveMessage") {
            let rosterVcardData = decryption('vcard_data');
            let newChatTo = (messageData.messageType === "carbonSentMessage") ? this.handleSplitUserId(messageData.to) : rosterVcardData.fromuser;
            if(recentChatFrom.indexOf(newChatTo) === -1) {
                SDK.getVcard(newChatTo + '@' + REACT_APP_XMPP_SOCKET_HOST);
                let currentRecentChat = {
                    recent: {
                        NotificationTo:"",
                        msgfrom: newChatTo,
                        tempname: "",
                        msgto: newChatFrom,
                        publisher: newChatFrom,
                        time: messageData.time,
                        status:"",
                        msgid:messageData.msgid,
                        msgbody:messageData.msgbody,
                        chattype:messageData.chattype,
                        broadcastId:"",
                        broadcastMsgId:"",
                        MessageType:messageData.msgbody.message_type,
                        recallstatus:"",
                        unReadCount:""
                    },
                    roster: ""
                }
                let newFinalData = finalData.push(currentRecentChat);
                this.setState({ recentChat: newFinalData, filterItem: newFinalData });
            }
        }
    }

    /**
     * componentDidUpdate is one of the react lifecycle method. <br />
     *
     * In this method to handle the any update in roster and message data.
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        let data = [];
        let recentRoster = [];
        if (localStorage.getItem("roster_data") !== null && localStorage.getItem("recentchat_data") !== null) {
            let localRoster = decryption('roster_data');
            let localRecent = [];
            if (localStorage.getItem("new_recent_chat_data") !== null) {
                let local = decryption("new_recent_chat_data");
                local.forEach(element => {
                    localRecent.push(element.recent);
                });
            } else {
                localRecent = decryption('recentchat_data');
            }
            if (prevProps.rosterData && prevProps.rosterData.id !== this.props.rosterData.id && prevProps.recentChatData) {
                localRecent && localRecent.map((recent) => {
                    localRoster && localRoster.map((roster) => {
                        let rosterJid = (roster.username) ? roster.username : roster.jid;
                        if (recent.msgfrom === rosterJid) {
                            data.push({
                                recent: recent,
                                roster: roster
                            });
                            recentRoster.push(rosterJid);
                        }
                    });
                    if(recent.chattype === "normal") {
                        this.props.groupsData.data.groups.map((groups) => {
                            if (recent.msgfrom === groups.jid) {
                                this.handleGroupMembersList(groups.jid);
                                data.push({
                                    recent: recent,
                                    roster: groups
                                });
                            }
                        });
                    } else if (!recentRoster.includes(recent.msgfrom) && recent.chattype === "chat") {
                            data.push({
                                recent: recent,
                                roster: ""
                            });
                    }
                });
                if (localStorage.getItem("new_recent_chat_data") !== null) {
                    this.setState({ recentChat: data, loaderStatus: false, filterItem: data });
                } else {
                    this.setState({ recentChat: data.sort(recentChatCompare).reverse(), filterItem: data.sort(recentChatCompare).reverse(), loaderStatus: false });
                }
            } else if (this.props.messageData && this.props.messageData.data) {
                if(this.props.messageData.data.messageType === "carbonSentMessage" ||
                this.props.messageData.data.messageType === "carbonReceiveMessage") {
                    this.handleNewRecentChat(this.props.messageData.data);
                }
                if (this.props.messageData.data.msgbody && this.props.messageData.data.msgbody && prevProps.messageData && prevProps.messageData.id !== this.props.messageData.id) {
                    if (this.props.messageData.data.to) {
                        let finalData = this.state.filterItem;
                        let toUser = this.handleSplitUserId(this.props.messageData.data.to);
                        let msgFrom = this.handleSplitUserId(this.props.messageData.data.from);
                        let messageType = this.props.messageData.data.msgbody.message_type;
                        this.handleReorder(finalData, toUser, msgFrom, messageType, this.props.messageData).then((response) => {
                            this.setState({ recentChat: response, filterItem: response }, () => {
                                encryption('new_recent_chat_data', response);
                            });
                        });
                    } else if (this.props.messageData.data.from && !this.props.messageData.data.hasOwnProperty('to') && this.props.messageData.data.msgbody) {
                        let finalData = this.state.filterItem;
                        let fromUser = this.handleSplitUserId(this.props.messageData.data.from);
                        let messageType = this.props.messageData.data.msgbody.message_type;
                        this.handleFromChatReorder(finalData, fromUser, messageType, this.props.messageData).then((response) => {
                            this.setState({ recentChat: response, filterItem: response }, () => {
                                encryption('new_recent_chat_data', response);
                            });
                        });
                    }
                } else if (prevProps.messageData.id !== this.props.messageData.id && this.props.messageData && this.props.messageData.data && this.props.messageData.data.messageType === "carbonSentSeen") {

                    console.log('filterItem', this.state.filterItem)
                    let finalData = this.state.filterItem;
                    let toId = this.props.messageData.data.toid;
                    finalData.map(function (e) {
                        if (e.recent.msgfrom === toId) {
                            e.recent.unReadCount = 0;
                        }
                        return e.recent.msgfrom;
                    });
                    this.setState({ recentChat: finalData, filterItem: finalData }, async () => {
                        await encryption('new_recent_chat_data', finalData);
                    });
                }
                if (prevProps.messageData.id !== this.props.messageData.id) {
                    if (this.props.messageData.data.messageType === "carbonSentMessage") {
                        var toUser = this.handleSplitUserId(this.props.messageData.data.to);
                        this.handleMessageMsgStatus(toUser, "0");
                    } else if (this.props.messageData.data.messageType === "carbonReceive") {
                        var fromUser = this.handleSplitUserId(this.props.messageData.data.from);
                        this.handleMessageMsgStatus(fromUser, "1");
                    } else if (this.props.messageData.data.messageType === "carbonSeen") {
                        var seenFromUser = this.handleSplitUserId(this.props.messageData.data.from);
                        this.handleMessageMsgStatus(seenFromUser, "2");
                    }
                }
            }
            if (prevProps.VCardContactData && prevProps.VCardContactData.id !== this.props.VCardContactData.id) {
                this.handleVCardContactData(this.props.VCardContactData);
            }
        }
    }

    handleVCardContactData = (response) => {
        let rosterData = decryption("roster_data");
        if (rosterData !== null) {
            let recentChatData = this.state.filterItem;
            rosterData.forEach((item) => {
                let userJid = item.jid ? item.jid : item.username;
                if (userJid === response.data.fromuser) {
                    item.image = response.data.image;
                    item.status = response.data.userstatus;
                }
            });
            recentChatData && recentChatData.map(function (e) {
                let jid = e.roster.jid ? e.roster.jid : e.roster.username;
                if (jid === response.data.fromuser) {
                    e.roster.image = response.data.image;
                    e.roster.status = response.data.userstatus;
                }
                return e;
            });
        }
        let recentChatData = this.state.recentChat;
        let roster = {
            displayName: response.data.nickname,
            image: response.data.image,
            jid: response.data.fromuser,
            status: response.data.userstatus
        }
        recentChatData.map((item) => {
            if(item.recent.msgfrom === response.data.fromuser) {
                item.roster = roster;
            }
        });
        this.setState({recentChat: recentChatData});
    }

    /**
     * handleGroupMembersList() method to get the group members list.
     */
    handleGroupMembersList = (groupsJid) => {
        // SDK.getGroupParticipants(groupsJid + '@mix.fly.dev.mirrorfly.com')
    }


    /**
     * handleFromChatReorder() method to handle reorder the from chat.
     */
    handleFromChatReorder = async (finalData, fromUser, messageType, messageData) => {
        let filterData = finalData.filter(ele => {
            if (ele.recent.msgfrom === fromUser) {
                ele.recent.publisher = "";
                ele.recent.unReadCount = parseInt(ele.recent.unReadCount) + 1;
                ele.recent.MessageType = messageType;
                ele.recent.msgbody = this.handleRecentChatMessageType(messageType, messageData);
                return ele;
            }
        });
        let remain = finalData.map(ele => {
            if (ele.recent.msgfrom !== fromUser) {
                return ele;
            }
        }).filter(ele => ele)
        return await filterData.concat(remain);
    }

    /**
     * handleRecentChatMessageType() method to handle recent chat message type.
     *
     * @param {string} messageType
     * @param {object} messageData
     */
    handleRecentChatMessageType(messageType, messageData) {
        if (messageType === "text") {
            return messageData.data.msgbody;
        } else {
            return messageType.charAt(0).toUpperCase() + messageType.slice(1);
        }
    }

    /**
     * handleSplitUserId() method to handle split user id from response.
     *
     * @param {string} userId
     */
    handleSplitUserId(userId) {
        return userId.split("@").shift();
    }


    /**
     * handleShowContacts() method to handle weather the contacts should display based on search result.
     *
     * @param {string} value
     */
    handleShowContacts = (value) => {
        this.setState({ isShowContacts: value });
    }

    /**
     * handleMessageMsgStatus() method to update the status type into recent chat data.
     *
     * @param {string} userId
     * @param {string} type
     *
     * example :
     *
     * Status Type 0 - sent, 1 - unread, 2 - seen
     */
    handleMessageMsgStatus(userId, type) {
        let finalData = this.state.recentChat;
        finalData.map(function (e) {
            if (e.recent.msgfrom === userId) {
                e.recent.status = type
            }
            return e.recent.status;
        });
        this.setState({ recentChat: finalData, filterItem: finalData }, async () => {
            await encryption('new_recent_chat_data', finalData);
        });
    }

    /**
     * componentWillUnmount() is one of the react lifecycle method.
     *
     * In this method the unmounting the states.
     */
    componentWillUnmount() {
        this.setState({ recentChat: "", loaderStatus: "", filterItem: "", searchElement: "", isShowContacts: "" });
    }

    /**
     * handleSearchFilterList() method is to handle the searched contacts from list
     *
     * @param {object} filterData
     * @param {string} searchWith
     */
    handleSearchFilterList(filterData, searchWith) {
        this.setState({ filterItem: filterData, searchElement: searchWith });
    }

    /**
     * handleRecentMsgTime() method to format the message time.
     *
     * @param {array} msgTo
     * @param {object} response
     */
    handleRecentMsgTime(msgTo, response) {
        if (msgTo === response.recent.msgfrom) {
            let milliseconds = this.props.messageData.data.time / 1000000;
            let timemilliseconds = milliseconds * 1000;
            response.recent.msgtime = formatChatDateTime(new Date(timemilliseconds), 'recent-chat');
        }
    }

    /**
     * handleTimeStamp() method to manage the message time format.
     * @param {object} response
     */
    handleTimeStamp(response) {
        if (this.props.messageData && this.props.messageData.data) {
            if (this.props.messageData.data.to) {
                let msgTo = this.handleSplitUserId(this.props.messageData.data.to);
                this.handleRecentMsgTime(msgTo, response);
            } else if (this.props.messageData.data.from && !this.props.messageData.data.hasOwnProperty('to') && this.props.messageData.data.msgbody) {
                let msgTo = this.handleSplitUserId(this.props.messageData.data.from);
                this.handleRecentMsgTime(msgTo, response);
            }
        }
        if (response.recent && response.recent.msgtime) {
            return response.recent.msgtime;
        }
        if (response.recent && response.recent.time) {
            return formatChatDateTime(convertUTCTOLocalTimeStamp(response.recent.time), 'recent-chat');
        }
    }

    /**
     * handleSingleRecentChat() method to dispatch the action with contact info payload.
     *
     * In this method, to perform display the conversation header section.
     * @param {object} event
     * @param {object} response
     */
    handleSingleRecentChat = (e, response) => {
        const el = document.getElementsByClassName('chat-list-li');
        for (let element of el) {
            if (element.classList.contains("active")) {
                element.classList.remove("active");
            }
        }
        let closet = e.target.closest("li");
        closet.classList.add("active");
        return Store.dispatch(SingleRecentChatAction(response));
    }

    /**
     * handleMessage() method to display the message and sync with mobile.
     *
     * @param {object} response
     */
    handleMessageTyping(response) {
        if (this.props.messageData && this.props.messageData.data) {
            if (this.props.messageData.data.messageType === "composing") {
                let fromUser = this.handleSplitUserId(this.props.messageData.data.from);
                if (fromUser === response.recent.msgfrom) {
                    return true;
                }
            }
        }
    }

    /**
     * handleMsgStatusIcon() method to handle the message status icon.
     *
     * @param {object} item
     */
    handleMsgStatusIcon(item) {
        return (this.props.vCardData.data.fromuser === item.recent.publisher) ? item.recent.status === "0" ? <i className="user-status-sent"></i> : item.recent.status === "1" ? <i className="user-status-receive"></i> : <i className="user-status"></i> : "";
    }

    handleMessageType = (item) => {
        switch (item.recent.MessageType) {
            case "text":
                return item.recent.msgbody.message;
            case "image":
                return <><i className="chat-camera"><Camera /></i> {"Image"}</>;
            case "video":
                return <><i className="chat-video"><Video /></i> {"Video"}</>;
            case "audio":
                return <><i className="chat-audio"><Audio /></i> {"Audio"}</>;
            case "file":
                return <><i className="chat-docu"><Document /></i> {"File"}</>
            default:
                return;
        }
    }

    /**
     * render() method to render the WebChatRecentChat component into browser.
     */
    render() {
        const loaderStyle = {
            width: 80,
            height: 80
        }

        if (this.state.loaderStatus) {
            return <div className="loader-container"><img src={loaderSVG} alt="loader" style={loaderStyle} /></div>
        }

        return (
            <>
                {this.state.recentChat.length > 0 ?
                    <>
                        <WebChatSearch searchIn={this.state.searchIn} rosterDataResponse={this.state.recentChat} handleSearchFilterList={this.handleSearchFilterList} />
                        <ul className="chat-list-ul">
                            {this.state.searchElement !== "" && this.state.filterItem.length > 0 &&
                                <div className="search-head">Chats</div>
                            }
                            {this.state.filterItem && this.state.filterItem.map((item, index) => {
                                let contactName = item.roster.displayName ? item.roster.displayName : (item.roster.name ? item.roster.name : (item.roster.nickName ? item.roster.nickName : item.recent.msgfrom));
                                let typingMsg = this.handleMessageTyping(item);
                                let msgStatus = this.handleMsgStatusIcon(item);
                                let lastMsg = this.handleMessageType(item);
                                return (
                                    <li className="chat-list-li" id="chat-list-id" data-name="list" key={index} onClick={(e) => this.handleSingleRecentChat(e, item)}>
                                        <WebChatRecentChatItem item={item} />
                                        <div className="recentchats">
                                            <div className="recent-username-block">
                                                <div className="recent-username">
                                                    <span className="username">
                                                        <h3 title={contactName}>
                                                            {this.state.searchElement !== "" ?
                                                                getHighlightedText(contactName, this.state.searchElement) :
                                                                contactName
                                                            }
                                                        </h3>
                                                    </span>
                                                </div>
                                                <span className={item.recent && parseInt(item.recent.unReadCount) !== 0 ? "messagetime-plus" : "messagetime"}>
                                                    {this.handleTimeStamp(item)}
                                                </span>
                                            </div>
                                            <div className="recent-message-block">
                                                <span title={item.recent.MessageType === "text" ? lastMsg : item.recent.MessageType.charAt(0).toUpperCase() + item.recent.MessageType.slice(1)}>
                                                    {typingMsg === true ? "typing..." : <>{msgStatus}
                                                        {lastMsg}
                                                    </>}
                                                </span>
                                                <div className="recent-message-icon">
                                                    {item.recent && parseInt(item.recent.unReadCount) !== 0 && <p className="notifi">{item.recent.unReadCount > 9 ? "9+" : item.recent.unReadCount}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                        <WebChatSearchRoster recentChatDataList={this.state.filterItem} searchElement={this.state.searchElement} handleShowContacts={this.handleShowContacts} />
                        {this.state.filterItem.length === 0 && !this.state.isShowContacts &&
                            <div className="no-search-record-found">{NO_SEARCH_CHAT_CONTACT_FOUND}</div>
                        }
                    </>
                    : <>
                        <div className="norecent-chat">
                            <i className="norecent-chat-img">
                                <Rechatchatimage />
                            </i>
                            <h4>{NO_RECENT_CHAT_INFO}</h4>
                            <h4>{NO_RECENT_CLICK_ON_INFO}<i><Nochat /></i> {NO_RECENT_SEARCH_CONTACTS_INFO}</h4>
                        </div>
                    </>}
            </>
        );
    }
}

const mapStateToProps = (state, props) => {
    console.log('state of VCardContactData', state.VCardContactData)
    return {
        rosterData: state.rosterData,
        recentChatData: state.recentChatData,
        messageData: state.messageData,
        VCardContactData: state.VCardContactData,
        groupsData: state.groupsData,
        vCardData: state.vCardData
    }
}

export default connect(mapStateToProps, null)(WebChatRecentChat);
