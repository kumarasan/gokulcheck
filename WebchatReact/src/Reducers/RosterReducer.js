import { ROSTER_DATA } from '../Actions/Constants';

export default function RosterReducer(state = [], action) {
  switch (action.type) {
    case ROSTER_DATA:
      return action.payload;  
    default:
      return state;
  }
}
