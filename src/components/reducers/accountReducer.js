import { FETCH_PLAN_INFO, GIVE_FEEDBACK } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_PLAN_INFO:
      return { ...state, ...action.payload };
    case GIVE_FEEDBACK:
      return { ...state, feedback: { ...action.payload } };
    default:
      return state;
  }
};
