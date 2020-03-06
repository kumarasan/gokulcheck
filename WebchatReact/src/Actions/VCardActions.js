import uuidv4 from 'uuid/v4';
import { VCARD_DATA, VCARD_CONTACT_DATA_ACTION } from './Constants';
import { decryption, encryption } from '../Components/WebChat/WebChatEncryptDecrypt';

export const VCardDataAction = (data) => {
  return {
    type: VCARD_DATA,
    payload: {
      id: uuidv4(),
      data
    }
  }
}

export const VCardContactDataAction = (data) => {
  return {
    type: VCARD_CONTACT_DATA_ACTION,
    payload: {
      id: uuidv4(),
      data
    }
  }
}

export const VCardProfileImageAction = (data) =>  async dispatch => {
  let localVCard = decryption ('vcard_data');
  if(localVCard.fromuser === data.user) {
    localVCard.image = data.image;
    encryption("vcard_data", localVCard);
  }  
}
