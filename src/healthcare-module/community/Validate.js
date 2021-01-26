import * as yup from "yup";

const ALLOWED_NAME_CHARACTERS = /^[a-zA-Z0-9 -,.]*$/;
const ALLOWED_CHARACTERS = /^[a-zA-Z0-9 -,.'"]*$/;
export const validationSchema = yup.object().shape({
    communityName: yup
        .string()
        .required('Community Name is required')
        .min(2, 'Community Name must be at least 2 characters')
        .max(40, 'Community Name cannot be greater than 40 characters')
        .matches(ALLOWED_NAME_CHARACTERS, 'Special Characters are not allowed'),
    communityCountry: yup.string().required('Please select valid country'),
    communityState: yup
        .string()
        .required('State/province/town is required')
        .min(2, 'State/province/town must be at least 2 characters')
        .max(40, 'State/province/town cannot be greater than 40 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityCity: yup
        .string()
        .required('City is required')
        .min(2, 'City must be at least 2 characters')
        .max(40, 'City cannot be greater than 40 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityStreet: yup
        .string()
        .required('Street address is required')
        .min(2, 'Street address must be at least 2 characters')
        .max(40, 'Street address cannot be greater than 40 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityDescription: yup
        .string()
        .required('Description is required')
        .min(2, 'Description must be at least 2 characters')
        .max(50, 'Description cannot be greater than 50 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    lat: yup.number().typeError('Latitude must be a number').nullable(),
    lng: yup.number().typeError('Longitude must be a number').nullable()
});