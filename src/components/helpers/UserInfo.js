export const getUserProfile = () => {
  let data = decodePayloadToken();
  if (data !== null && data !== undefined) {
    return data.scope[0];
  }
  return null;
};

export const getssoId = () => {
  let token = decodePayloadToken();
  if (token !== null && token !== undefined) {
    return token.ssoId;
  }
  return null;
};

export const getToken = () => {
  let token = sessionStorage.getItem('authUser');
  if (token !== null && token !== undefined) {
    return JSON.parse(token).access_token;
  }
};

export const getPermissions = () => {
  let token = decodePayloadToken();
  if (token !== null && token !== undefined) {
    return token.authorities;
  }
  return null;
};

export const getApcId = () => {
  let token = decodePayloadToken();
  if (token !== null && token !== undefined) {
    return token.user.apcId;
  }
};

export const getDepartmentId = () => {
  let token = decodePayloadToken();
  if (token !== null && token !== undefined) {
    return token.user.departmentId;
  }
};

export const decodePayloadToken = () => {
  let token = sessionStorage.getItem('authUser');
  token = JSON.parse(token);
  if (token !== null && token !== undefined) {
    let payload = token.access_token.split('.')[1];
    return JSON.parse(window.atob(payload));
  }
  return null;
};

export const getSubscription = () => {
  let sub = sessionStorage.getItem('subscription');
  if (sub !== null && sub !== undefined) {
    return JSON.parse(sub);
  }
};

export const getAllUserModules = () => {
  let mod = sessionStorage.getItem('modules');
  if (mod !== null && mod !== undefined) {
    return JSON.parse(mod);
  }
};

export const userHasModuleAccess = (moduleCode) => {
  let modules = getAllUserModules();
  if (modules !== null && modules !== undefined) {
    for (let key in modules) {
      if (module[key].productCode === moduleCode) {
        return true;
      }
    }
  }

  return false;
};
