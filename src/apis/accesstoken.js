import axios from "axios";


export default axios.create({
    baseURL : process.env.REACT_APP_ACCESS_TOKEN_URL,
    transformRequest: [function (data, headers) {
        let  token = window.btoa(data.username+':'+data.password);
        headers['Authorization'] = `Basic ${token}`;

        let form = new FormData();
        form.set('password', data.password);
        form.set('username', data.username);
        form.set('grant_type', data.grant_type);
        //form.set('client_id', data.username);

        return form;
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

});

