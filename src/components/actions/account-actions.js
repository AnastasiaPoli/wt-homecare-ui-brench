import history from '../../history';
import accountauth from '../../apis/accountauth';
import accountnoauth from '../../apis/accountnoauth';

import {
  CHANGE_MY_PASSWORD,
  FETCH_USER,
  GIVE_FEEDBACK,
  INIT_ADDUSER_INFO,
  LOGIN,
  SAVE_MY_PROFILE,
  SAVE_USER
} from './types';

import { handleException } from './global-exception-handler';

const defaultErrorObject = {
  message: 'Could not connect to account service. Please try again later',
  statusCode: 'OK',
  messageType: 'error',
  token: null
};

export const forgotPasswordAction = (formValues) => async (dispatch, getState) => {
  try {
    let response = await accountnoauth.post('/auth/forgotPassword', { ...formValues });
    if (response && response.data != null) {
      dispatch({ type: LOGIN, payload: { forgotPassword: response.data } });
      history.push('/login');
    } else {
      dispatch({ type: LOGIN, payload: { errorMessage: response.data } });
    }
  } catch (error) {
    handleException(dispatch, error, LOGIN, defaultErrorObject);
  }
};

export const loadUserDetailsSelfReg = (ssoid) => async (dispatch) => {
  try {
    const response = await accountnoauth.get(`/auth/findUser/${ssoid}`);

    if (response && response.data != null) {
      dispatch({ type: FETCH_USER, payload: response.data });
    }
  } catch (error) {
    handleException(dispatch, error, FETCH_USER, defaultErrorObject);
  }
};

//add-user-get

export const loadRequiredNewUserInfo = () => async (dispatch) => {
  try {
    let response = await accountauth.get('/admin/add-user-get');
    if (response && response.data != null) {
      dispatch({ type: INIT_ADDUSER_INFO, payload: response.data });
    }
  } catch (error) {
    handleException(dispatch, error, INIT_ADDUSER_INFO, defaultErrorObject);
  }
};

export const addNewUserAction = (formValues) => async (dispatch) => {
  try {
    let response = await accountauth.post('/admin/save-user', { ...formValues });
    if (response && response.data != null) {
      if (formValues.ssoId !== null && formValues.ssoId !== undefined) {
        dispatch({ type: SAVE_USER, payload: response.data });
      } else {
        history.push('/manage-users');
      }
    }
  } catch (error) {
    handleException(dispatch, error, SAVE_USER, defaultErrorObject);
  }
};

export const loadSingleUserDetails = () => async (dispatch) => {
  try {
    const response = await accountauth.get('/current-user');

    if (response && response.data != null) {
      dispatch({ type: FETCH_USER, payload: response.data });
    }
  } catch (error) {
    handleException(dispatch, error, FETCH_USER, defaultErrorObject);
  }
};

export const saveMyProfileActions = (formValues) => async (dispatch) => {
  try {
    let response = await accountauth.post('/save-profile-edit', { ...formValues });
    if (response && response.data != null) {
      dispatch({ type: SAVE_MY_PROFILE, payload: response.data });
    }
  } catch (error) {
    handleException(dispatch, error, SAVE_MY_PROFILE, defaultErrorObject);
  }
};

export const updateMyPasswordActions = (formValues) => async (dispatch) => {
  try {
    let response = await accountauth.post('/save-password-change', { ...formValues });
    if (response && response.data != null) {
      dispatch({ type: CHANGE_MY_PASSWORD, payload: response.data });
    }
  } catch (error) {
    handleException(dispatch, error, CHANGE_MY_PASSWORD, defaultErrorObject);
  }
};

export const sendFeedback = (formValues) => async (dispatch) => {
  try {
    let response = await accountauth.post('/give-us-feedback', { ...formValues });
    if (response && response.data != null) {
      dispatch({ type: GIVE_FEEDBACK, payload: response.data });
    }
  } catch (error) {
    handleException(dispatch, error, GIVE_FEEDBACK, defaultErrorObject);
  }
};
