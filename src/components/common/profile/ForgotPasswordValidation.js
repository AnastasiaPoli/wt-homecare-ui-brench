
export const  validatePasswordForgotForm = (formValues) => {
    const errors = {};
    const ALLOWED_CHARACTERS = /^[a-zA-Z0-9- ,_]*$/;


    if(!formValues.username){
        errors.username = 'Please Enter User ID';
    }

    if(formValues.username){
        const username =  formValues.username;
        if(username.length < 3) {
            errors.username = 'User ID must be greater than 3 Charaters';
        }

        if(username.length > 45) {
            errors.username = 'User ID must be less then 45 Characters';
        }

        if(!ALLOWED_CHARACTERS.test(username)){
            errors.username = 'User ID contains invalid Characters. Please review your entry';
        }
    }


    return errors;
};