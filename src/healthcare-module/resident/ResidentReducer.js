import axios from "axios";
import { getssoId, getToken } from "../../components/helpers/UserInfo";

const RESIDENT_ACTIONS = {
  LOAD_LIST: "LOAD_LIST",
  LOAD_DATA: "LOAD_DATA",
  SAVE_DATA: "SAVE_DATA",
  DELETE_DATA: "DELETE_DATA",
  CLEAR_RESPONSE: "CLEAR_RESPONSE",
};

const initialState = {
  residentList: [],
  RESIDENT: null,
  response: null,
  total: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RESIDENT_ACTIONS.LOAD_LIST:
      return {
        ...state,
        residentList: action.payload,
        total: action.payload.length,
      };
    case RESIDENT_ACTIONS.LOAD_DATA:
      return {
        ...state,
        RESIDENT: action.payload,
      };
    case RESIDENT_ACTIONS.SAVE_DATA:
      return {
        ...state,
        response: action.payload,
      };
    case RESIDENT_ACTIONS.DELETE_DATA:
      return {
        ...state,
        response: action.payload,
      };
    case RESIDENT_ACTIONS.CLEAR_RESPONSE:
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

export const fetchResidentList = () => {
  return (dispatch) => {
    axiosInstance
      .get("/manage-resident")
      .then((response) => {
        dispatch({
          type: RESIDENT_ACTIONS.LOAD_LIST,
          payload: response.data.object,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const addResident = (resident) => {
  return (dispatch) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    resident.companyId = user.apcId;
    axiosInstance
      .post("/add-resident", resident)
      .then((response) => {
        dispatch({
          type: RESIDENT_ACTIONS.SAVE_DATA,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const updateResident = (resident) => {
  return (dispatch) => {
    axiosInstance
      .put("/edit-resident", resident)
      .then((response) => {
        dispatch({
          type: RESIDENT_ACTIONS.SAVE_DATA,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const clearResponse = () => {
  return (dispatch) => dispatch({ type: RESIDENT_ACTIONS.CLEAR_RESPONSE });
};

export const fetchResident = (id) => {
  return (dispatch) => {
    axiosInstance
      .get("/read-resident", { params: { pain: id } })
      .then((response) => {
        dispatch({
          type: RESIDENT_ACTIONS.LOAD_DATA,
          payload: response.data.object,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteResident = (id) => {
  return (dispatch) => {
    axiosInstance
      .delete("/delete-resident", { params: { pain: id } })
      .then((response) => {
        dispatch({
          type: RESIDENT_ACTIONS.DELETE_DATA,
          payload: response.data,
        });
        dispatch(fetchResidentList());
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
