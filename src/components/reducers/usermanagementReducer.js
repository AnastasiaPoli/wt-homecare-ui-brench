import { CHANGE_MY_PASSWORD, SAVE_MY_PROFILE } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CHANGE_MY_PASSWORD:
      return { ...state, changeMyPassword: action.payload };
    case SAVE_MY_PROFILE:
      return { ...state, saveMyProfile: action.payload };
    default:
      return state;
  }
};
