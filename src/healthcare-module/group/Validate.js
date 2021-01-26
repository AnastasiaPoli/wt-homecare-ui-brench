import * as yup from "yup";

const ALLOWED_NAME_CHARACTERS = /^[a-zA-Z0-9 -,.]*$/;
const ALLOWED_CHARACTERS = /^[a-zA-Z0-9 -,.'"]*$/;
export const validationSchema = yup.object().shape({
    groupName: yup
        .string()
        .required('Group Name is required')
        .min(2, 'Group Name must be at least 2 characters')
        .max(40, 'Group Name cannot be greater than 40 characters')
        .matches(ALLOWED_NAME_CHARACTERS, 'Special Characters are not allowed'),
    cid: yup.number().required('Please select a community'),
    groupCountry: yup.string().required('Please select valid country'),
    groupState: yup
        .string()
        .required('State/province/town is required')
        .min(2, 'State/province/town must be at least 2 characters')
        .max(40, 'State/province/town cannot be greater than 40 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    groupCity: yup
        .string()
        .required('City is required')
        .min(2, 'City must be at least 2 characters')
        .max(40, 'City cannot be greater than 40 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    groupStreet: yup
        .string()
        .required('Street address is required')
        .min(2, 'Street address must be at least 2 characters')
        .max(40, 'Street address cannot be greater than 40 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    groupDescription: yup
        .string()
        .required('Description is required')
        .min(2, 'Description must be at least 2 characters')
        .max(50, 'Description cannot be greater than 50 characters')
        .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    lat: yup.number().typeError('Latitude must be a number').nullable(),
    lng: yup.number().typeError('Longitude must be a number').nullable()
});