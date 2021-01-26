import React from 'react';
import {Field, reduxForm} from 'redux-form';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CircularProgress from '@material-ui/core/CircularProgress';

import {forgotPasswordAction} from "../../actions/account-actions";
import {validatePasswordForgotForm} from "./ForgotPasswordValidation";
import {ReCaptcha} from "react-recaptcha-v3";
import {displaySystemMessage} from "../MessageObject";


const logo = require('../../../images/logo_noBG.png');
const captchaSiteKey= '6LcrYawUAAAAAEyAjgJo7jfrWBqVYKKU2jbUxwo_';

class ForgotPassword extends React.Component{

    state = {
        loading : false,
        recaptchaToken : ''
    };


    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevState.loading){
            this.setState({loading: false});
        }
    }

    verifyCallback = (recaptchaToken) => {
        if(recaptchaToken !== null && recaptchaToken !== undefined) {
            this.setState({recaptchaToken: recaptchaToken});
        }
    }

    renderError(formProps){
        if(formProps.meta.touched  && formProps.meta.invalid){
            return true;
        }
        return false;
    }

    renderField = (formProps) => {
        return(
            <TextField
                id={formProps.id}
                label={formProps.label}
                variant="outlined"
                error = {this.renderError(formProps)}
                {...formProps.input}
                helperText= {formProps.meta.touched ? formProps.meta.error : ""}
                fullWidth
                type={formProps.type}
            />

        );
    };


    submitForm = formValues => {
        this.setState({loading:true});

        //Add any other form values
        formValues.captchaToken = this.state.recaptchaToken;

        this.props.forgotPasswordAction(formValues);



    }


    useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },

        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        green: {
            color: '#fff',
            backgroundColor: '#008080',
        },
    }));


    renderFormView = () => {

        if(!this.state.loading){
            return(
                <Paper elevation={4}>
                    <div style={{marginLeft:'45%'}}>
                        <Avatar style={{backgroundColor :'orange'}}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" style={{marginLeft:'-22%'}}>
                            Enter your User ID
                        </Typography>
                    </div>
                    <form id="create" noValidate autoComplete="off" style={{padding:'25px'}} onSubmit={this.props.handleSubmit(this.submitForm)}>
                        <Field name = "username" component={this.renderField} label="User ID *"  type="text" id="username"/>

                        <br/><br/>
                        <Button variant="contained" color="primary" type="submit" fullWidth>Submit</Button>
                        <br/>  <br/>
                        <small>This site is protected by reCAPTCHA and the Google
                            <a href="https://policies.google.com/privacy"> Privacy Policy</a> and
                            <a href="https://policies.google.com/terms"> Terms of Service</a> apply.
                        </small>
                        <br/>  <br/>
                        <Grid>
                            <Link href="/login">
                                <KeyboardBackspaceIcon /> Back to Login
                            </Link>
                        </Grid>

                        <ReCaptcha
                            sitekey={captchaSiteKey}
                            action='company_registration'
                            verifyCallback={this.verifyCallback}
                        />
                    </form>


                    <br />
                </Paper>
            );
        }else{
            return(
                <div>
                    <br/><br/><br/><br/><br/>
                    <CircularProgress size={80} />
                    <div>...Processing your request</div>
                </div>
            );
        }
    }



    render() {

        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit">
                            <img width={30} height={30} src={logo} alt="Worktrim Logo" />
                        </Typography>

                        <Typography variant="h6" color="inherit">
                            Worktrim
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container  maxWidth="xl" className ="app-body-content">
                    {displaySystemMessage(this.props.forgotPassword)}
                    <Container component="main" maxWidth="sm">
                        {this.renderFormView()}
                    </Container>
                </Container>
            </React.Fragment>
        );
    }

}


const formWrapped = reduxForm({
    form : 'forgot_password_form',
    validate : validatePasswordForgotForm,
})(ForgotPassword);

const  mapSystemErrorsToProps = state => {

    return {forgotPassword : state.authentication};
}
export default connect(mapSystemErrorsToProps , {forgotPasswordAction})(formWrapped);

