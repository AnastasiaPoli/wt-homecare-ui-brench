import axios from 'axios';
import { getssoId, getToken } from '../../components/helpers/UserInfo';

const COMMUNITY_ACTIONS = {
  LOAD_LIST: 'LOAD_LIST',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA',
  DELETE_DATA: 'DELETE_DATA',
  CLEAR_RESPONSE: 'CLEAR_RESPONSE'
};

const initialState = {
  communityList: [],
  community: null,
  response: null,
  total: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case COMMUNITY_ACTIONS.LOAD_LIST:
      return {
        ...state,
        communityList: action.payload,
        total: action.payload.length
      };
    case COMMUNITY_ACTIONS.LOAD_DATA:
      return {
        ...state,
        community: action.payload
      };
    case COMMUNITY_ACTIONS.SAVE_DATA:
      return {
        ...state,
        response: action.payload
      };
    case COMMUNITY_ACTIONS.DELETE_DATA:
      return {
        ...state,
        response: action.payload
      };
    case COMMUNITY_ACTIONS.CLEAR_RESPONSE:
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

export const fetchCommunityList = () => {
  return (dispatch) => {
    axiosInstance
      .get('/manage-community')
      .then((response) => {
        dispatch({
          type: COMMUNITY_ACTIONS.LOAD_LIST,
          payload: response.data.object
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addCommunity = (community) => {
  return (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    community.companyId = user.apcId;
    axiosInstance
      .post('/add-community', community)
      .then((response) => {
        dispatch({
          type: COMMUNITY_ACTIONS.SAVE_DATA,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateCommunity = (community) => {
  return (dispatch) => {
    axiosInstance
      .put('/edit-community', community)
      .then((response) => {
        dispatch({
          type: COMMUNITY_ACTIONS.SAVE_DATA,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const clearResponse = () => {
  return (dispatch) => dispatch({ type: COMMUNITY_ACTIONS.CLEAR_RESPONSE });
};

export const fetchCommunity = (id) => {
  return (dispatch) => {
    axiosInstance
      .get('/read-community', { params: { cid: id } })
      .then((response) => {
        dispatch({
          type: COMMUNITY_ACTIONS.LOAD_DATA,
          payload: response.data.object
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteCommunity = (id) => {
  return (dispatch) => {
    axiosInstance
      .delete('/delete-community', { params: { cid: id } })
      .then((response) => {
        dispatch({
          type: COMMUNITY_ACTIONS.DELETE_DATA,
          payload: response.data
        });
        dispatch(fetchCommunityList());
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
