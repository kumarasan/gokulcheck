import uuidv4 from 'uuid/v4';
import { MESSAGE_DATA, MESSAGE_CARBON_DATA } from './Constants';

export const MessageAction = (data) => {
    return {
        type: MESSAGE_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}

export const MessageCarbonAction = (data) => {
    return {
        type: MESSAGE_CARBON_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}
