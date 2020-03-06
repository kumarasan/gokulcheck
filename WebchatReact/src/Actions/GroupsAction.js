import uuidv4 from 'uuid/v4';
import { GROUPS_DATA } from './Constants';

export const GroupsDataAction = (data) => {
    return {
        type: GROUPS_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}
