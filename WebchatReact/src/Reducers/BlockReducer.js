import { BLOCK_DATA } from '../Actions/Constants';

export function BlockReducer(state = [], action) {
    switch(action.type) {
        case BLOCK_DATA:
            return action.payload;
        default:
            return state;
    }
}
