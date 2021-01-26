
import { useSelector, useDispatch} from 'react-redux'

import {getssoId, getPermissions, getUserProfile, getDepartmentId, getApcId} from "./UserInfo";

export  const StateData = props => {

    const auth = useSelector(state => state.authentication);
    const tokenData = auth.token;

    console.log(props);

    let token = tokenData;

    let decodedToken =  null
    if (token !== null && token !== undefined) {
        let payloadToken = token.split('.')[1];
        let userInfo = JSON.parse(window.atob(payloadToken));

        decodedToken = userInfo;
    }

    const ssoid =  getssoId(decodedToken);
    const permissions = getPermissions(decodedToken);
    const profile = getUserProfile(decodedToken);
    const csrftoken = token !== undefined ? token.split('.')[0] : null;
    const theToken = token;
    const depid = getDepartmentId(decodedToken);
    const apcid = getApcId(decodedToken);


   const userDetails = {
            ssoid:ssoid,
            permissions:permissions,
            profile:profile,
            csrftoken:csrftoken,
            theToken:theToken,
            depid:depid,
            apcid:apcid
      };

    const dispatch = useDispatch();
    dispatch({ type: 'USER_DATA' , payload: userDetails});

};