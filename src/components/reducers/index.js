import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authenticationReducer from "./authenticationReducer";
import systemMessageReducer from "./systemMessageReducer";
import adminDashboardReducer from "./adminDashboardReducer";
import usermanagementReducer from "./usermanagementReducer";
import accountReducer from "./accountReducer";
import groupReducer from "../../healthcare-module/group/GroupReducer";
import communityReducer from "../../healthcare-module/community/CommunityReducer";
import residentReducer from "../../healthcare-module/resident/ResidentReducer";

export default combineReducers({
  form: formReducer,
  authentication: authenticationReducer,
  systemMessage: systemMessageReducer,
  aDashboard: adminDashboardReducer,
  umgr: usermanagementReducer,
  account: accountReducer,
  group: groupReducer,
  community: communityReducer,
  resident: residentReducer,
});
