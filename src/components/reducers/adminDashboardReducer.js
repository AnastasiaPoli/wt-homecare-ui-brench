import { ADMIN_DASHBOARD } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case ADMIN_DASHBOARD:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
