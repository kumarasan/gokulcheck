import uuidv4 from 'uuid/v4';
import { BLOCK_DATA } from './Constants';

export const BlockDataAction = (data) => {
    return {
        type: BLOCK_DATA,
        payload: {
            id: uuidv4(),
            data
        }
    }
}
