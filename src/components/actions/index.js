import history from '../../history';
import token from '../../apis/accesstoken';
import accountauth from '../../apis/accountauth';

import { permissionConstants } from '../helpers/PermissionConstants';

import { LOGIN } from './types';

const defaultErrorObject = {
  message: 'Could not connect to authentication service. Please try again later',
  statusCode: 'OK',
  messageType: 'error',
  token: null
};

const invalidCredentials = {
  message: 'Wrong Username or Password',
  statusCode: 'BAD_REQUEST',
  messageType: 'error',
  token: null
};

export const loginAction = (formValues) => async (dispatch) => {
  try {
    let response;
    response = await token.post('/auth/userLogin', { ...formValues });
    if (response.status === 200 && response.data.hasOwnProperty('access_token')) {
      let respData = response.data;
      sessionStorage.setItem('authUser', JSON.stringify(response.data));
      let role = null;
      let payload = respData.access_token.split('.')[1];
      let payloadData = JSON.parse(window.atob(payload));
      role = payloadData.scope[0];

      let response2 = await accountauth.get('/current-user');

      if (response2.status === 200 && response2.data != null) {
        let activity = response2.data.activity;
        let subscription = {
          scheduler: response2.data.schedulePlan,
          timeclock: response2.data.timeclockPlan,
          healthcarePlan: response2.data.healthcarePlan
        };

        //add subscription info to session
        sessionStorage.setItem('subscription', JSON.stringify(subscription));
        //add modules to session
        sessionStorage.setItem('modules', JSON.stringify(response2.data.modules));
        sessionStorage.setItem('user', JSON.stringify(response2.data.user));

        if (activity !== null && activity.passwordUpdated === 'Y') {
          history.push('/change-password');
        } else {
          //send them to dashboard or logout
          if (role === permissionConstants.role.ADMIN_ROLE || role === permissionConstants.role.EMPLOYEE_ROLE) {
            //Lets now dispatch data to store
            dispatch({ type: LOGIN, payload: respData });
            history.push('/dashboard');
          } else {
            history.push('/login');
          }
        }
      } else {
        //send them to dashboard or logout
        if (role === permissionConstants.role.ADMIN_ROLE || role === permissionConstants.role.EMPLOYEE_ROLE) {
          history.push('/dashboard');
        } else {
          history.push('/login');
        }
      }
    }
  } catch (error) {
    if (error.response !== undefined) {
      if (error.response.status === 401) {
        dispatch({ type: LOGIN, payload: { errorMessage: invalidCredentials } });
      } else {
        dispatch({ type: LOGIN, payload: { errorMessage: error.response.data } });
      }
    } else {
      dispatch({ type: LOGIN, payload: { errorMessage: defaultErrorObject } });
    }
  }
};
