import uuidv4 from 'uuid/v4';
import { CONNECTION_STATE_DATA } from './Constants';

export const WebChatConnectionState = (data) => {
    if (data === "CONNECTED") {
        return {
            type: CONNECTION_STATE_DATA,
            payload: {
                id: uuidv4(),
                data
            }
        }
    }
}
