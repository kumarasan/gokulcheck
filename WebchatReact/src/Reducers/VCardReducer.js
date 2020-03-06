import { VCARD_DATA, VCARD_CONTACT_DATA_ACTION } from '../Actions/Constants';

export function VCardReducer(state = [], action) {
  switch (action.type) {
    case VCARD_DATA:
      return action.payload;  
    default:
      return state;
  }
}

export function VCardContactReducer(state = [], action) {
  switch (action.type) {
    case VCARD_CONTACT_DATA_ACTION:
      return action.payload;  
    default:
      return state;
  }
}
