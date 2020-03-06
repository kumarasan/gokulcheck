import uuidv4 from 'uuid/v4';
import { RECENT_CHAT_DATA, SINGLERECENT_CHAT_DATA, PROFILE_IMAGE_CHAT_DATA } from './Constants';
import { decryption, encryption } from '../Components/WebChat/WebChatEncryptDecrypt';
import { array } from 'prop-types';

export const RecentChatAction = (data) => {
    return {
        type: RECENT_CHAT_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}

export const SingleRecentChatAction = (data) => {
    return {
        type: SINGLERECENT_CHAT_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}

export const WebChatProfileImageAction = (data) => async dispatch => {
    let localRoster = decryption('roster_data');
    localRoster && typeof(localRoster) === "object" &&  localRoster.find(item => {
        let toUserId = item.username ? item.username : item.jid;
        if(toUserId === data.user) {
            item.image = data.image;
        }
        return item;
    });
    encryption('roster_data', localRoster);
    return {
        type: PROFILE_IMAGE_CHAT_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}
