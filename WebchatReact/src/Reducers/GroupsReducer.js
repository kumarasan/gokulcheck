import { GROUPS_DATA } from '../Actions/Constants';

export default function GroupsReducer(state = [], action) {
  switch (action.type) {
    case GROUPS_DATA:
      return action.payload;  
    default:
      return state;
  }
}