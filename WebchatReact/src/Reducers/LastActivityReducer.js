import { LAST_ACTIVITY_DATA } from '../Actions/Constants';

export function LastActivityReducer(state = [], action) {
   switch (action.type) {
        case LAST_ACTIVITY_DATA:
           return action.payload;
        default:
           return state;
   }
}