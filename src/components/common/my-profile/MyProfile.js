import React from 'react';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Field, Form, Formik } from 'formik';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

import Topbar from '../../top-navigation/Topbar';
import { getPermissions, getUserProfile } from '../../helpers/UserInfo';
import BreadCrumb from '../../top-navigation/BreadCrumb';
import SystemMessages from '../SystemMessages';
import { loadSingleUserDetails, saveMyProfileActions } from '../../actions/account-actions';
import { editMyProfileValidations } from './UserValidation';
import { renderTextFieldEdit } from '../../../util/WtFields';

class MyProfile extends React.Component {
  componentDidMount() {
    this.props.loadSingleUserDetails();
  }

  renderEditForm = () => {
    let thisUser = this.props.umgr.userInfo;

    if (thisUser !== undefined) {
      const user = thisUser.user;
      return (
        <Formik
          initialValues={{
            firstName: user.firstName !== null ? user.firstName : '',
            lastName: user.lastName !== null ? user.lastName : '',
            email: user.email !== null ? user.email : '',
            otherNames: user.otherNames !== null ? user.otherNames : ''
          }}
          validationSchema={editMyProfileValidations}
          enableReinitialize={true}
          onSubmit={(values) => {
            this.submitForm(values);
          }}
        >
          {({ errors, handleChange, touched }) => (
            <Form style={{ padding: '25px' }}>
              <Field name="firstName" component={renderTextFieldEdit} label="First Name *" id="firstName" type="text" />
              <Field name="lastName" component={renderTextFieldEdit} label="Last Name *" id="lastName" type="text" />
              <Field
                name="otherNames"
                component={renderTextFieldEdit}
                label="Other Names"
                id="otherNames"
                type="text"
              />
              <Field name="email" component={renderTextFieldEdit} label="Email" id="email" type="email" />

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
    } else {
      return <div> ..Loading</div>;
    }
  };

  submitForm = (formValues) => {
    formValues.ssoId = this.props.umgr.userInfo.user.ssoId;

    console.log('form values', formValues);
    this.props.saveMyProfileActions(formValues);
  };

  render() {
    return (
      <React.Fragment>
        <Topbar permissions={getPermissions()} role={getUserProfile()} />
        <BreadCrumb
          activeParentLabel="Dashboard"
          activeParentLink="/dashboard"
          activeChildLabel="My Profile"
          activeChildLink="/my-profile"
        />
        <Container maxWidth="xl" className="app-body-content">
          <SystemMessages />
          <Container component="main" maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Paper elevation={6} className="data-container-paper">
                  <div className="data-container-paper-inner">
                    <h3>Account and Security Information</h3>
                    <hr />
                    <Link to="/change-password" style={{ textDecoration: 'none' }}>
                      <LockOpenIcon />
                      Change Password
                    </Link>
                  </div>
                </Paper>
              </Grid>
              <Grid item md={8}>
                <Paper elevation={6} className="data-container-paper">
                  <div className="data-container-paper-inner">
                    <h3>
                      <EditIcon /> My Profile{' '}
                    </h3>
                    <hr />

                    {this.renderEditForm()}
                  </div>
                </Paper>
              </Grid>
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
export default connect(mapStateToProps, { loadSingleUserDetails, saveMyProfileActions })(MyProfile);
