import React from 'react';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Field, Form, Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';

import Topbar from '../../top-navigation/Topbar';
import { getPermissions, getUserProfile } from '../../helpers/UserInfo';
import BreadCrumb from '../../top-navigation/BreadCrumb';
import { updateMyPasswordActions } from '../../actions/account-actions';
import { changePasswordValidations } from './UserValidation';
import { renderPasswordField } from '../../../util/WtFields';
import { displaySystemMessage } from '../MessageObject';

class ChangePassword extends React.Component {
  renderEditForm = () => {
    return (
      <Formik
        initialValues={{
          existingPassword: '',
          password: '',
          passwordConfirm: ''
        }}
        validationSchema={changePasswordValidations}
        enableReinitialize={true}
        onSubmit={(values) => {
          this.submitForm(values);
        }}
      >
        {({ errors, handleChange, touched }) => (
          <Form style={{ padding: '25px' }}>
            <Field
              name="existingPassword"
              component={renderPasswordField}
              label="Existing Password"
              id="opassword"
              type="password"
            />
            <Field
              name="password"
              component={renderPasswordField}
              label="New Password"
              id="npassword"
              type="password"
            />
            <Field
              name="passwordConfirm"
              component={renderPasswordField}
              label="New Password Confirmation"
              id="passwordConfirm"
              type="password"
            />
            <br />
            <br />

            <Grid>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  };

  submitForm = (formValues) => {
    this.props.updateMyPasswordActions(formValues);
  };

  render() {
    return (
      <React.Fragment>
        <Topbar permissions={getPermissions()} role={getUserProfile()} />
        <BreadCrumb
          activeParentLabel="Dashboard"
          activeParentLink="/"
          activeChildLabel="Update Password"
          activeChildLink="/my-profile"
        />
        <Container maxWidth="xl" className="app-body-content">
          {displaySystemMessage(this.props.aDashboard)}
          <Container component="main" maxWidth="lg">
            <Grid container spacing={1}>
              <Paper elevation={6} className="data-container-paper">
                <div className="data-container-paper-inner">
                  <h3>
                    <EditIcon /> Change Password{' '}
                  </h3>
                  <hr />

                  {this.renderEditForm()}
                </div>
              </Paper>
            </Grid>
          </Container>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps, { updateMyPasswordActions })(ChangePassword);
