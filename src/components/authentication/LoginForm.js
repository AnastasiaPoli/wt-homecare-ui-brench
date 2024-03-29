import React from 'react';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Paper,
  Toolbar,
  Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { loginAction } from '../actions';
import history from '../../history';
import { permissionConstants } from '../helpers/PermissionConstants';
import { getUserProfile } from '../helpers/UserInfo';
import { renderPasswordField, renderTextFieldEdit } from '../../util/WtFields';
import { loginValidations } from './LoginValidations';
import { displaySystemMessage } from '../common/MessageObject';
import logo from '../../images/logo_noBG.png';

class LoginForm extends React.Component {
  state = { loading: false };

  componentDidMount() {
    let role = getUserProfile();
    if (role === permissionConstants.role.EMPLOYEE_ROLE || role === permissionConstants.role.ADMIN_ROLE) {
      history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.loading) {
      this.setState({ loading: false });
    }
  }

  submitForm = (formValues) => {
    this.setState({ loading: true });
    formValues.grant_type = 'password';

    this.props.loginAction(formValues);
  };

  useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },

    submit: {
      margin: theme.spacing(3, 0, 2)
    },
    green: {
      color: '#fff',
      backgroundColor: '#008080'
    }
  }));

  buildLoginForm = () => {
    if (!this.state.loading) {
      return (
        <Formik
          initialValues={{
            username: '',
            password: ''
          }}
          validationSchema={loginValidations}
          enableReinitialize={true}
          onSubmit={(values) => {
            this.submitForm(values);
          }}
        >
          {({ errors, handleChange, touched }) => (
            <Form id="apc_login" noValidate autoComplete="off" style={{ padding: '25px' }}>
              <br />
              <br />
              <Field
                name="username"
                component={renderTextFieldEdit}
                label="Username *"
                id="username"
                type="text"
                marg="none"
              />
              <br />
              <br />
              <Field
                name="password"
                component={renderPasswordField}
                label="Password *"
                id="password"
                type="password"
                marg="none"
              />
              <br /> <br />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
      );
    } else {
      return (
        <div style={{marginTop:'3rem',display:'flex',flexDirection:'column',alignItems:'center', justifyContent:'center'}}>
          <CircularProgress size={80} />
          <div>... Processing your request</div>
        </div>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <Grid container spacing={2}>
              <Grid item xs={3} md={3}>
                <div>
                  <img width={30} height={30} src={logo} alt="Worktrim Logo" />
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Worktrim</span>
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" className="app-body-content">
          {displaySystemMessage(this.props.authentication)}
          <Container component="main" maxWidth="sm">
            <Paper elevation={4}>
              <div style={{ paddingTop: '1.5rem',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column' }}>
                <Avatar style={{ backgroundColor: 'orange' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
              </div>

              {this.buildLoginForm()}
              <br />
            </Paper>
          </Container>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps, { loginAction })(LoginForm);
