import { RECENT_CHAT_DATA, SINGLERECENT_CHAT_DATA, PROFILE_IMAGE_CHAT_DATA } from '../Actions/Constants';

export function RecentChatReducer(state = [], action) {
  switch (action.type) {
    case RECENT_CHAT_DATA:
      return action.payload;
    default:
      return state;
  }
}

export function SingleChatReducer(state = [], action) {
  switch (action.type) {
    case SINGLERECENT_CHAT_DATA:
      return action.payload;
    default:
      return state;
  }
}

export function WebChatProfileImageReducer(state = [], action) {
  switch (action.type) {
    case PROFILE_IMAGE_CHAT_DATA:
      return action.payload;
    default:
      return state;
  }
}
