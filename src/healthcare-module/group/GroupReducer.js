import axios from 'axios';
import { getssoId, getToken } from '../../components/helpers/UserInfo';

const GROUP_ACTIONS = {
  LOAD_LIST: 'LOAD_LIST',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA',
  DELETE_DATA: 'DELETE_DATA',
  CLEAR_RESPONSE: 'CLEAR_RESPONSE'
};

const initialState = {
  groupList: [],
  group: null,
  response: null,
  total: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GROUP_ACTIONS.LOAD_LIST:
      return {
        ...state,
        groupList: action.payload,
        total: action.payload.length
      };
    case GROUP_ACTIONS.LOAD_DATA:
      return {
        ...state,
        group: action.payload
      };
    case GROUP_ACTIONS.SAVE_DATA:
      return {
        ...state,
        response: action.payload
      };
    case GROUP_ACTIONS.DELETE_DATA:
      return {
        ...state,
        response: action.payload
      };
    case GROUP_ACTIONS.CLEAR_RESPONSE:
      return {
        ...state,
        response: null
      };
    default:
      return state;
  }
};

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HEALTHCARE_URL,
  transformRequest: [
    function (data, headers) {
      const token = getToken();
      const ssoId = getssoId();
      headers['Authorization'] = `Bearer ${token}`;
      headers['uid'] = `${ssoId}`;
      return JSON.stringify(data);
    }
  ],
  headers: { 'Content-Type': 'application/json' }
});

export const fetchGroupList = () => {
  return (dispatch) => {
    axiosInstance
      .get('/manage-group')
      .then((response) => {
        dispatch({
          type: GROUP_ACTIONS.LOAD_LIST,
          payload: response.data.object
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addGroup = (group) => {
  return (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    group.companyId = user.apcId;
    axiosInstance
      .post('/add-group', group)
      .then((response) => {
        dispatch({
          type: GROUP_ACTIONS.SAVE_DATA,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateGroup = (group) => {
  return (dispatch) => {
    axiosInstance
      .put('/edit-group', group)
      .then((response) => {
        dispatch({
          type: GROUP_ACTIONS.SAVE_DATA,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const clearResponse = () => {
  return (dispatch) => dispatch({ type: GROUP_ACTIONS.CLEAR_RESPONSE });
};

export const fetchGroup = (id) => {
  return (dispatch) => {
    axiosInstance
      .get('/read-group', { params: { hgid: id } })
      .then((response) => {
        dispatch({
          type: GROUP_ACTIONS.LOAD_DATA,
          payload: response.data.object
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteGroup = (id) => {
  return (dispatch) => {
    axiosInstance
      .delete('/delete-group', { params: { hgid: id } })
      .then((response) => {
        dispatch({
          type: GROUP_ACTIONS.DELETE_DATA,
          payload: response.data
        });
        dispatch(fetchGroupList());
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
