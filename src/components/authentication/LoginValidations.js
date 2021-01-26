
import * as yup from "yup";

const ALLOWED_CHARACTERS = /^[a-zA-Z0-9- ,_.]*$/;

export const loginValidations = () => {

    let loginValidationSchema = {
        username : yup
            .string()
            .min(3, 'should be at least 3 characters')
            .max(25, "must be less than 25 charaters")
            .matches(ALLOWED_CHARACTERS, "Special characters are not allowed")
            .required("Please Enter username."),



        password : yup
            .string()
            .required("Please Provide Password"),

    };

    return yup.object().shape(loginValidationSchema);

}


