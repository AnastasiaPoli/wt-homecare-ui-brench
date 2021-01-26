import React from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import WarningIcon from '@material-ui/icons/Warning';
import Switch from '@material-ui/core/Switch';

export const renderTextField = ({ label, input, meta: { touched, invalid, error }, ...custom }) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
    margin="dense"
    fullWidth
    variant="outlined"
  />
);

export const renderRadioButton = ({ input, meta: { touched, error }, children, ...rest }) => (
  <FormControl error={hasErrorMessage({ touched, error })}>
    {displayErrorMessage({ touched, error })}
    <RadioGroup {...input} {...rest} onChange={input.onChange}>
      {children}
    </RadioGroup>
  </FormControl>
);

export const renderCheckbox = ({ input, label }) => (
  <div>
    <FormControlLabel
      control={<Checkbox checked={input.value ? true : false} onChange={input.onChange} color="primary" />}
      label={label}
    />
  </div>
);

export const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <FormControl error={hasErrorMessage({ touched, error })} variant="outlined">
    <Select margin="dense" native {...input} {...custom} inputProps={{ name: input.name, id: 'dep' }}>
      {children}
    </Select>
    {displayErrorMessage({ touched, error })}
  </FormControl>
);

/**********************************************

 FORMIK Fields
 ***********************************************/

export const renderTextFieldEdit = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    label={field.label}
    placeholder={field.label}
    error={hasEditErrorMessage(touched, errors, field)}
    id={field.id}
    {...field}
    {...props}
    margin={field.margin !== null && field.margin !== undefined ? field.margin : 'dense'}
    fullWidth={true}
    variant="outlined"
    helperText={displayErrorMessageEdit(touched, errors, field)}
  />
);

export const renderTextFieldSelect = ({ field, form: { touched, errors }, children, ...props }) => (
  <TextField
    select
    label={field.label}
    placeholder={field.label}
    error={hasEditErrorMessage(touched, errors, field)}
    id={field.id}
    {...field}
    {...props}
    margin={field.margin !== null && field.margin !== undefined ? field.margin : 'dense'}
    fullWidth={true}
    variant="outlined"
    helperText={displayErrorMessageEdit(touched, errors, field)}
  >
    {children}
  </TextField>
);

export const renderTextArea = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    label={field.label}
    placeholder={field.label}
    error={hasEditErrorMessage(touched, errors, field)}
    id={field.id}
    {...field}
    {...props}
    fullWidth={true}
    variant="outlined"
    multiline={true}
    rows={4}
    helperText={displayErrorMessageEdit(touched, errors, field)}
  />
);

export const renderTimePicker = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    label={field.label}
    placeholder={field.label}
    error={hasEditErrorMessage(touched, errors, field)}
    id={field.id}
    {...field}
    {...props}
    fullWidth={false}
    variant="outlined"
    type="time"
    InputLabelProps={{
      shrink: true
    }}
    inputProps={{
      step: 300 // 5 min
    }}
    helperText={displayErrorMessageEdit(touched, errors, field)}
  />
);

export const renderPasswordField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    label={field.label}
    placeholder={field.label}
    error={hasEditErrorMessage(touched, errors, field)}
    id={field.id}
    {...field}
    {...props}
    margin={field.margin !== null && field.margin !== undefined ? field.margin : 'dense'}
    fullWidth={true}
    variant="outlined"
    type="password"
    helperText={displayErrorMessageEdit(touched, errors, field)}
  />
);

export const renderRadioButtonEdit = ({ field, form: { touched, errors }, children, ...props }) => (
  <FormControl error={hasEditErrorMessage(touched, errors, field)}>
    <RadioGroup {...field} {...props} onChange={field.onChange}>
      {children}
    </RadioGroup>
    {displayErrorMessageEdit(touched, errors, field)}
  </FormControl>
);

export const renderSelectFieldEdit = ({ field, form: { touched, errors }, children, ...props }) => (
  <FormControl error={hasEditErrorMessage(touched, errors, field)} variant="outlined">
    <Select margin="dense" native={true} {...field} {...props} inputProps={{ name: field.name, id: field.name }}>
      {children}
    </Select>
    {displayErrorMessageEdit(touched, errors, field)}
  </FormControl>
);

export const renderSelectFieldClassic = ({ field, form: { touched, errors }, children, ...props }) => (
  <FormControl
    error={hasEditErrorMessage(touched, errors, field)}
    variant={field.variant}
    fullWidth={field.fullwidth}
    size={field.size}
  >
    <Select margin={field.margin} native={true} {...field} {...props} inputProps={{ name: field.name, id: field.name }}>
      {children}
    </Select>
    {displayErrorMessageEdit(touched, errors, field)}
  </FormControl>
);

export const renderCheckboxEdit = ({ field, form: { touched, errors }, ...props }) => (
  <div>
    <FormControlLabel
      className={props.className}
      control={
        <Checkbox
          checked={field.value ? true : false}
          onChange={field.onChange}
          color="primary"
          name={field.name}
          id={field.name}
        />
      }
      label={props.label}
    />
  </div>
);

export const renderSwitch = ({ field, form: { touched, errors }, ...props }) => (
  <div>
    <FormControlLabel
      className={props.className}
      control={
        <Switch
          checked={field.value ? true : false}
          onChange={field.onChange}
          color="primary"
          name={field.name}
          id={field.name}
        />
      }
      label={props.label}
    />
  </div>
);

const hasEditErrorMessage = (touched, errors, field) => {
  let theField = field.name;
  if (errors.hasOwnProperty(theField) && touched.hasOwnProperty(theField)) {
    return true;
  }
  return false;
};

const displayErrorMessageEdit = (touched, errors, field) => {
  let theField = field.name;
  if (errors.hasOwnProperty(theField) && touched.hasOwnProperty(theField)) {
    const msg = Object.getOwnPropertyDescriptor(errors, theField);
    return (
      <span>
        {' '}
        <WarningIcon fontSize="small" /> {msg.value}
      </span>
    );
  } else {
    return null;
  }
};

const hasErrorMessage = ({ touched, error }) => {
  if (!(touched && error)) {
    return false;
  } else {
    return true;
  }
};

const displayErrorMessage = ({ touched, error }) => {
  if (!(touched && error)) {
    return;
  } else {
    return (
      <FormHelperText>
        {' '}
        <WarningIcon fontSize="small" /> {touched && error}
      </FormHelperText>
    );
  }
};
