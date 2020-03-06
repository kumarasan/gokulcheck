import { combineReducers } from 'redux';
import { ConnectionStateReducer } from './ConnectionStateReducer';
import { VCardReducer, VCardContactReducer} from './VCardReducer';
import RosterReducer from './RosterReducer';
import { RecentChatReducer, SingleChatReducer, WebChatProfileImageReducer } from './RecentChatReducer';
import { MessageReducer, MessageCarbonReducer} from './MessageReducer';
import GroupsReducer from './GroupsReducer';
import { BlockReducer } from './BlockReducer';
import { LastActivityReducer } from './LastActivityReducer';

export default combineReducers({
    ConnectionStateData: ConnectionStateReducer,
    vCardData: VCardReducer,
    rosterData: RosterReducer,
    recentChatData: RecentChatReducer,
    messageData: MessageReducer,
    messageCarbonData: MessageCarbonReducer,
    singleRecentChatData: SingleChatReducer,
    WebChatProfileImageData: WebChatProfileImageReducer,
    VCardContactData: VCardContactReducer,
    groupsData: GroupsReducer,
    BlockData: BlockReducer,
    lastActivityData: LastActivityReducer
});