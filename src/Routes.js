import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import history from './history';

import LoginForm from './components/authentication/LoginForm';
import ForgotPassword from './components/common/profile/ForgotPassword';
import Logout from './components/authentication/Logout';
import Dashboard from './healthcare-module/Dashboard';
import MyProfile from './components/common/my-profile/MyProfile';
import ChangePassword from './components/common/my-profile/ChangePassword';
import { decodePayloadToken, getPermissions, getUserProfile } from './components/helpers/UserInfo';
import { permissionConstants } from './components/helpers/PermissionConstants';
import { permittedRoutes } from './components/helpers/PermittedRoutes';
import GiveFeedback from './components/common/feedback/GiveFeedback';
import HealthcareHome from './healthcare-module/HealthcareHome';
import HealthcareSettings from './healthcare-module/HealthcareSettings';
import ScrollToTop from './components/ScrollToTop';

const getRolesApplicableToThisRoute = (thisRoute, role, userPermissions) => {
  let requiredPermissions = [];
  if (role === permissionConstants.role.ADMIN_ROLE) {
    for (let key in permittedRoutes.adminRoutes) {
      if (thisRoute.startsWith(permittedRoutes.adminRoutes[key].url)) {
        requiredPermissions = permittedRoutes.adminRoutes[key].permissions;
        break;
      }
    }

    let commonRoutes = permittedRoutes.commonRoutes;
    for (let key3 in commonRoutes) {
      if (commonRoutes[key3].url.startsWith(thisRoute)) {
        return true;
      }
    }
  }

  if (role === permissionConstants.role.EMPLOYEE_ROLE) {
    for (let key2 in permittedRoutes.employeeRoutes) {
      if (thisRoute.startsWith(permittedRoutes.employeeRoutes[key2].url)) {
        requiredPermissions = permittedRoutes.employeeRoutes[key2].permissions;
        break;
      }
    }

    let commonRoutes = permittedRoutes.commonRoutes;
    for (let key4 in commonRoutes) {
      if (commonRoutes[key4].url.startsWith(thisRoute)) {
        return true;
      }
    }
  }

  for (let k = 0; k < requiredPermissions.length; k++) {
    if (userPermissions.indexOf(requiredPermissions[k]) === -1) {
      return false;
    }
  }
  if (requiredPermissions.length === 0) {
    return false;
  }
  return true;
};

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = decodePayloadToken();

      if (currentUser === null || currentUser === undefined) {
        return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
      }

      let role = getUserProfile();
      let userPermissions = getPermissions();
      let permittedForTargetRoute = getRolesApplicableToThisRoute(props.match.path, role, userPermissions);

      if (!permittedForTargetRoute) {
        if (role === permissionConstants.role.ADMIN_ROLE || permissionConstants.role.EMPLOYEE_ROLE) {
          return <Redirect to={{ pathname: '/dashboard', state: { from: props.location } }} />;
        } else {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        }
      }

      return <Component {...props} />;
    }}
  />
);

export default function Routes() {
  return (
    <Router history={history}>
      <CssBaseline />
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={LoginForm} />
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/logout" component={Logout} />
        <React.Fragment>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/my-profile" component={MyProfile} />
          <PrivateRoute exact path="/change-password" component={ChangePassword} />
          <PrivateRoute exact path="/give-feedback" component={GiveFeedback} />
          <PrivateRoute path="/healthcare" component={HealthcareHome} />
          <PrivateRoute exact path="/healthcare-settings" component={HealthcareSettings} />
        </React.Fragment>
      </Switch>
    </Router>
  );
}
