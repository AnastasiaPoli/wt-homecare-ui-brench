import axios from 'axios';
import {getToken, getssoId} from "../components/helpers/UserInfo";


export default axios.create({
    baseURL : process.env.REACT_APP_WT_TIMECLOCK_URL,
    transformRequest: [function (data, headers) {
        const token = getToken();
        const ssoId =  getssoId();

        headers['Authorization'] = `Bearer ${token}`;
        headers['UID'] = `${ssoId}`;
        return JSON.stringify(data);
    }],
    headers: {
        'Content-Type': 'application/json'
    }

});