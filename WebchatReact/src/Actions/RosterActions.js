import uuidv4 from 'uuid/v4';
import { parsedContacts, compare } from '../Helpers/Utility';
import { ROSTER_DATA } from './Constants';
import { encryption } from '../Components/WebChat/WebChatEncryptDecrypt';
import { REACT_APP_API_URL } from '../Components/processENV';

export const RosterData = (data) => {
    return {
        type: ROSTER_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}

export const RosterDataAction = (data) => async dispatch => {
    let token = localStorage.getItem('token');
    if (token !== null) {
        await fetch(`${REACT_APP_API_URL}/contus/mail/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                "syncTime": ""
            })
        }).then(response => response.json())
            .then(async (res) => {
                if (res.status === 200) {
                    let concateData = [...res.data.created, ...data];
                    let parsedData = await parsedContacts(concateData);
                    let contacts = await parsedData.sort(compare);
                    encryption("roster_data", contacts);
                    dispatch(RosterData(contacts));
                } else {
                    encryption("roster_data", data);
                    dispatch(RosterData(data));
                }
            }).catch((error) => {
                encryption("roster_data", data);
                dispatch(RosterData(data));
                console.log("error message for email contact sync: ", error);
            });
    }
}
