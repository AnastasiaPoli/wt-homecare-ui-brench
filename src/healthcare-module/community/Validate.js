import * as yup from "yup";

const ALLOWED_NAME_CHARACTERS = /^[a-zA-Z0-9 +-,.]*$/;
const ALLOWED_CHARACTERS = /^[a-zA-Z0-9 -,.'"]*$/;

export const validationSchema = yup.object().shape({
    communityName: yup
        .string()
        .required('Community name is required')
        .min(2, 'Community name must be at least 2 characters')
        .max(40, 'Community name cannot be greater than 40 characters'),
        // .matches(ALLOWED_NAME_CHARACTERS, 'Special Characters are not allowed'),
    communityCountry: yup.string().required('Please select valid country'),
    communityState: yup
        .string()
        .required('state/province/town is required')
        .min(2, 'state/province/town must be at least 2 characters')
        .max(40, 'state/province/town cannot be greater than 40 characters'),
        // .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityCity: yup
        .string()
        .required('city is required')
        .min(2, 'city must be at least 2 characters')
        .max(40, 'city cannot be greater than 40 characters'),
        // .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityStreet: yup
        .string()
        .required('street address is required')
        .min(2, 'street address must be at least 2 characters')
        .max(40, 'street address cannot be greater than 40 characters'),
        // .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityDescription: yup
        .string()
        .required('')
        .min(2, 'description must be at least 2 characters')
        .max(50, 'description cannot be greater than 50 characters'),
        // .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityZipCode: yup
        .string()
        .required('zip code is required')
        .min(2, 'zip code must be at least 2 characters')
        .max(40, 'zip code cannot be greater than 40 characters'),
        // .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    communityAddress: yup
        .string()
        .required('address is required')
        .min(2, 'address must be at least 2 characters')
        .max(40, 'address cannot be greater than 40 characters'),
        // .matches(ALLOWED_CHARACTERS, 'Special Characters are not allowed'),
    
    lat: yup.number().typeError('latitude must be a number').nullable(),
    lng: yup.number().typeError('longitude must be a number').nullable()
});