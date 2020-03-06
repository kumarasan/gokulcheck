import { encryption, decryption } from './WebChat/WebChatEncryptDecrypt';
import Store from '../Store';
import { VCardDataAction, VCardContactDataAction } from '../Actions/VCardActions';
import { RosterDataAction } from '../Actions/RosterActions';
import { RecentChatAction } from '../Actions/RecentChatActions';
import { MessageAction } from '../Actions/MessageActions';
import { GroupsDataAction } from '../Actions/GroupsAction';
import { BlockDataAction } from '../Actions/BlockAction'
import { WebChatConnectionState } from '../Actions/ConnectionState';
import { LastActivityDataAction } from '../Actions/LastActivityDataAction';
const createHistory = require("history").createBrowserHistory;
export var strophe = false;
export var socketId = "";
export const history = createHistory();

/**
 * To check the isLogin status
 */
export const isLogin = () => {
    if (localStorage.getItem("token")) {
        return true;
    }

    return false;
}

/**
 * To call the listener for SDK methods callback listener.
 *
 * <ul>
 *  <li>connectionListener</li>
 *  <li>callListener</li>
 *  <li>messageListener</li>
 *  <li>vcardListener</li>
 *  <li>blockUserListListener</li>
 *  <li>groupsListener</li>
 *  <li>rosterListener</li>
 *  <li>blockListListener</li>
 *  <li>favouriteMessageListListener</li>
 *  <li>recentChatListener</li>
 *  <li>presenceListener</li>
 * </ul>
 */
export var callbacks = {
    connectionListener: function (res) {
        console.log("connectionListener res: " + res);
        if (res === "CONNECTED") {
            strophe = true;
            localStorage.setItem("connection_status", res);
            Store.dispatch(WebChatConnectionState(res));
        } else if (res === "ERROROCCURED") {
            localStorage.setItem("connection_status", res);
            console.log("connection disconnected log.")
            window.location.reload();
        } else if (res === "DISCONNECTED") {
            localStorage.setItem("connection_status", res);
            console.log("connection disconnected log.");
        } else if (res === "CONNECTIONFAILED") {
            localStorage.setItem("connection_status", res);
            console.log("connection failed log.");
        } else if (res === "AUTHENTICATIONFAILED") {
            localStorage.setItem("connection_status", res);
            console.log("authentication failed log.");
        }
    },
    callListener: function (res) {
        console.log("call Listener res: " + JSON.stringify(res));
    },
    messageListener: function (res) {
        console.log("messageListener");
        console.log(res);
        Store.dispatch(MessageAction(res));
    },
    vcardListener: function (res) {
        let authUser = decryption('auth_user');
        if(authUser.username === res.fromuser) {
            encryption('vcard_data', res);
            Store.dispatch(VCardDataAction(res));
        } else {
            Store.dispatch(VCardContactDataAction(res));
        }
    },
    blockUserListListener: function (res) {
        console.log("blockUserList log: ", res);
        encryption("blockuserlist_data", res);
    },
    groupsListener: function (res) {
        console.log("groups log: ", res);
        encryption("groupslist_data", res);
        Store.dispatch(GroupsDataAction(res));
    },
    rosterListener: async function (res) {
        console.log("roster listener log: ", res);
        Store.dispatch(RosterDataAction(res));
    },
    blockListListener: function (res) {
        console.log("blocklist log: ", res);
        encryption("blocklist_data", res);
        Store.dispatch(BlockDataAction(res));
    },
    favouriteMessageListListener: function (res) {
        console.log("favouritesMessage log: ", res);
        encryption("favouritemsglist_data", res);
    },
    recentChatListener: function (res) {
        console.log("recentChat log: ", res);
        encryption('recentchat_data', res);
        Store.dispatch(RecentChatAction(res));
    },
    presenceListener: function (res) {
        encryption("presence_data", res);
    },
    lastActivityListener: function (res) {
        encryption("lastActivity_data", res);
        Store.dispatch(LastActivityDataAction(res));
    }
}
