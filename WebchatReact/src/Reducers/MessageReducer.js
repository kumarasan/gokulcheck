import { MESSAGE_DATA, MESSAGE_CARBON_DATA } from '../Actions/Constants';

export function MessageReducer(state = [], action) {
    switch (action.type) {
        case MESSAGE_DATA:
            return action.payload;
        default:
            return state;
    }
}

export function MessageCarbonReducer(state = [], action) {
    switch (action.type) {
        case MESSAGE_CARBON_DATA:
            return action.payload;
        default:
            return state;
    }
}
