import * as yup from 'yup';

const ALLOWED_CHARACTERS = /^[a-zA-Z0-9- ,_.]*$/;
const EMAIL_CHARACTERS = /^[a-zA-Z0-9- ,_@.]*$/;

export const userValidation = (formValues) => {
  const errors = {};

  if (!formValues.firstName) {
    errors.firstName = 'Please Enter First Name';
  }
  if (!formValues.lastName) {
    errors.lastName = 'Please Enter Last Name';
  }

  if (!formValues.email) {
    errors.email = 'Please Enter email address';
  }

  if (!formValues.dep) {
    errors.dep = 'Please select a valid department';
  }
  if (!formValues.role) {
    errors.role = 'Please select user role';
  }

  if (formValues.firstName) {
    if (formValues.firstName.length < 2) {
      errors.firstName = 'First name must be more than 2 Characters ';
    }
    if (formValues.firstName.length > 30) {
      errors.firstName = 'First name must be less than 30 Characters ';
    }

    if (!ALLOWED_CHARACTERS.test(formValues.firstName)) {
      errors.firstName = 'Username contains invalid Characters';
    }
  }

  if (formValues.lastName) {
    if (formValues.lastName.length < 2) {
      errors.lastName = 'Last name must be more than 2 Characters ';
    }
    if (formValues.lastName.length > 30) {
      errors.lastName = 'Last name must be less than 30 Characters ';
    }
    if (!ALLOWED_CHARACTERS.test(formValues.lastName)) {
      errors.lastName = 'Last name contains invalid Characters';
    }
  }

  if (formValues.otherNames) {
    if (formValues.otherNames.length < 2) {
      errors.otherNames = 'Other name must be more than 2 Characters ';
    }
    if (formValues.otherNames.length > 45) {
      errors.lastName = 'Other name must be less than 45 Characters ';
    }
    if (!ALLOWED_CHARACTERS.test(formValues.otherNames)) {
      errors.otherNames = 'Other contains invalid Characters';
    }
  }

  if (formValues.email) {
    if (formValues.email.length < 2) {
      errors.email = 'email name must be more than 2 Characters ';
    }
    if (formValues.email.length > 45) {
      errors.email = 'email must be less than 45 Characters ';
    }
    var re = /^[a-zA-Z0-9- ,_@.]*$/;

    if (!re.test(String(formValues.email).toLowerCase())) {
      errors.email = 'Please Enter a valid email';
    }
  }

  if (formValues.dep) {
    if (formValues.dep === 0) {
      errors.dep = 'Please select a valid department';
    }
  }

  return errors;
};

export const userValidations = () => {
  let userValidationSchema = {
    firstName: yup
      .string()
      .min(2, 'Must be atleast 2 chratacters')
      .max(30, 'Cannot be greater than 30 characters')
      .matches(ALLOWED_CHARACTERS, 'Special characters are not allowed')
      .required('This field is required.'),
    lastName: yup
      .string()
      .min(2, 'Must be atleast 2 chratacters')
      .max(30, 'Cannot be greater than 30 characters')
      .matches(ALLOWED_CHARACTERS, 'Special characters are not allowed')
      .required('This field is required.'),
    email: yup
      .string()
      .max(45, 'Cannot be greater than 45 characters')
      .matches(EMAIL_CHARACTERS, 'Special characters are not allowed')
      .email(),

    otherNames: yup.string().min(2, 'Must be atleast 2 chratacters').max(30, 'Cannot be greater than 30 characters'),
    dep: yup.number().min(1, 'Please select a valid department'),
    role: yup.string().required('This field is required').matches(ALLOWED_CHARACTERS, 'Please select Valid option'),
    HEALTH: yup.string().matches(ALLOWED_CHARACTERS, 'Please select Valid option'),
    SCHEDULER: yup.string().matches(ALLOWED_CHARACTERS, 'Special characters are not allowed'),
    NURSINGASSISTANT: yup.string().matches(ALLOWED_CHARACTERS, 'Special characters are not allowed'),
    REPORT: yup.string().matches(ALLOWED_CHARACTERS, 'Special characters are not allowed'),
    ACCOUNTMANAGER: yup.string().matches(ALLOWED_CHARACTERS, 'Special characters are not allowed'),
    TIMECLOCKMANAGER: yup.string().matches(ALLOWED_CHARACTERS, 'Special characters are not allowed'),
    USERMANAGER: yup.string().matches(ALLOWED_CHARACTERS, 'Special characters are not allowed')
  };

  return yup.object().shape(userValidationSchema);
};

export const advancedActionsValidations = () => {
  let advancedActionsValidationsSchema = {
    email: yup
      .string()
      .max(45, 'Cannot be greater than 45 characters')
      .min(5, 'Must be atleast 5 Characters')
      .matches(EMAIL_CHARACTERS, 'Special characters are not allowed')
      .email()
      .required('This field is required.')
  };

  return yup.object().shape(advancedActionsValidationsSchema);
};

export const selfRegistrationValidations = () => {
  let advancedActionsValidationsSchema = {
    email: yup
      .string()
      .max(45, 'Cannot be greater than 45 characters')
      .min(5, 'Must be atleast 5 Characters')
      .matches(EMAIL_CHARACTERS, 'Special characters are not allowed')
      .email()
      .required('This field is required.'),
    username: yup
      .string()
      .min(2, 'Must be atleast 2 characters')
      .max(85, 'Must be less than 85 characters')
      .matches(ALLOWED_CHARACTERS, 'Special characters are not allowed')
      .required('This field is required.'),
    password: yup
      .string()
      .min(3, 'should be at least 3 characters')
      .max(85, 'must be less than 85 charaters')
      .required('This field is required.'),
    passwordConfirm: yup.string().test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    })
  };

  return yup.object().shape(advancedActionsValidationsSchema);
};

export const editMyProfileValidations = () => {
  let userValidationSchema = {
    firstName: yup
      .string()
      .min(2, 'Must be atleast 2 chratacters')
      .max(30, 'Cannot be greater than 30 characters')
      .matches(ALLOWED_CHARACTERS, 'Special characters are not allowed')
      .required('This field is required.'),
    lastName: yup
      .string()
      .min(2, 'Must be atleast 2 chratacters')
      .max(30, 'Cannot be greater than 30 characters')
      .matches(ALLOWED_CHARACTERS, 'Special characters are not allowed')
      .required('This field is required.'),
    email: yup
      .string()
      .max(45, 'Cannot be greater than 45 characters')
      .matches(EMAIL_CHARACTERS, 'Special characters are not allowed')
      .email(),

    otherNames: yup.string().min(2, 'Must be atleast 2 chratacters').max(30, 'Cannot be greater than 30 characters')
  };

  return yup.object().shape(userValidationSchema);
};

export const changePasswordValidations = () => {
  let userValidationSchema = {
    existingPassword: yup
      .string()
      .min(3, 'should be at least 3 characters')
      .max(85, 'must be less than 85 charaters')
      .required('This field is required.'),
    password: yup
      .string()
      .min(3, 'should be at least 3 characters')
      .max(85, 'must be less than 85 charaters')
      .required('This field is required.'),
    passwordConfirm: yup.string().test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    })
  };

  return yup.object().shape(userValidationSchema);
};
