import { SYSTEM_MESSAGE } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case SYSTEM_MESSAGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
