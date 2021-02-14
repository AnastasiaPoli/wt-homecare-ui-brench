import axios from "axios";
import { getssoId, getToken } from "../../components/helpers/UserInfo";

const VITAL_ACTIONS = {
  LOAD_LIST: "LOAD_LIST",
  LOAD_DATA: "LOAD_DATA",
  SAVE_DATA: "SAVE_DATA",
  DELETE_DATA: "DELETE_DATA",
  CLEAR_RESPONSE: "CLEAR_RESPONSE",
};

const initialState = {
  vitalList: [],
  VITAL: null,
  response: null,
  total: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VITAL_ACTIONS.LOAD_LIST:
      return {
        ...state,
        vitalList: action.payload,
        total: action.payload.length,
      };
    case VITAL_ACTIONS.LOAD_DATA:
      return {
        ...state,
        VITAL: action.payload,
      };
    case VITAL_ACTIONS.SAVE_DATA:
      return {
        ...state,
        response: action.payload,
      };
    case VITAL_ACTIONS.DELETE_DATA:
      return {
        ...state,
        response: action.payload,
      };
    case VITAL_ACTIONS.CLEAR_RESPONSE:
      return {
        ...state,
        response: null,
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
      headers["Authorization"] = `Bearer ${token}`;
      headers["uid"] = `${ssoId}`;
      return JSON.stringify(data);
    },
  ],
  headers: { "Content-Type": "application/json" },
});

export const fetchVitalList = (id) => {
  return (dispatch) => {
    axiosInstance
      .get("/manage-vital", { params: { pain: id } })
      .then((response) => {
        dispatch({
          type: VITAL_ACTIONS.LOAD_LIST,
          payload: response.data.object,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addVital = (vital) => {
  return (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    vital.companyId = user.apcId;
    axiosInstance
      .post("/add-vital", vital)
      .then((response) => {
        dispatch({
          type: VITAL_ACTIONS.SAVE_DATA,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateVital = (vital) => {
  return (dispatch) => {
    axiosInstance
      .put("/edit-vital", vital)
      .then((response) => {
        dispatch({
          type: VITAL_ACTIONS.SAVE_DATA,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const clearResponse = () => {
  return (dispatch) => dispatch({ type: VITAL_ACTIONS.CLEAR_RESPONSE });
};

export const fetchVital = (id) => {
  return (dispatch) => {
    axiosInstance
      .get("/read-vital", { params: { pain: id } })
      .then((response) => {
        dispatch({
          type: VITAL_ACTIONS.LOAD_DATA,
          payload: response.data.object,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteVital = (id) => {
  return (dispatch) => {
    axiosInstance
      .delete("/delete-vital", { params: { pain: id } })
      .then((response) => {
        dispatch({
          type: VITAL_ACTIONS.DELETE_DATA,
          payload: response.data,
        });
        dispatch(fetchVitalList());
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
