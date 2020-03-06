import { CONNECTION_STATE_DATA } from '../Actions/Constants';

export function ConnectionStateReducer(state = [], action) {
    switch (action.type) {
        case CONNECTION_STATE_DATA:
            return action.payload;
        default:
            return state;
    }
}
