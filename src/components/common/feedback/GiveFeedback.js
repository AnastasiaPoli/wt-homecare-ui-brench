import React from "react";
import Container from "@material-ui/core/Container";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Field, Form, Formik} from "formik";
import Button from "@material-ui/core/Button";

import {renderTextArea, renderTextFieldEdit} from "../../../util/WtFields";
import Topbar from "../../top-navigation/Topbar";
import {getPermissions, getUserProfile} from "../../helpers/UserInfo";
import BreadCrumb from "../../top-navigation/BreadCrumb";
import {sendFeedback} from "../../actions/account-actions";
import {displaySystemMessage} from "../MessageObject";
import CircularProgress from "@material-ui/core/CircularProgress";

class GiveFeedback extends React.Component{

    state = {loading: false}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.loading){
            this.setState({loading:false});
        }
    }

    submitFeedbackForm = formValues => {
        this.setState({loading: true});
        this.props.sendFeedback(formValues);
    }

    renderFeedbackForm = () => {

        if(!this.state.loading) {
            return (
                <div className="data-container-paper-inner">
                    <Formik
                        initialValues={{
                            messageTitle: '',
                            messageContent: ''

                        }}
                        onSubmit={values => {
                            this.submitFeedbackForm(values);
                        }}>


                        {({errors, handleChange, touched}) => (
                            <Form id="submit-feedback">

                                <Field name="messageTitle" component={renderTextFieldEdit} label="Message Title *"
                                       id="messageTitle" type="text"/>
                                <br/> <br/>

                                <Field name="messageContent" component={renderTextArea} label="Message Content *"
                                       id="messageContent" type="text"/>
                                <br/> <br/>

                                <Button variant="contained" type="submit" color="primary">Submit</Button>

                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }else{
            return (<div style={{marginLeft : '30%'}}><CircularProgress size={70} /></div>);
        }
        }








    render() {

        return (
            <React.Fragment>
                <Topbar permissions = {getPermissions()}  role = {getUserProfile()}/>
                <BreadCrumb activeParentLabel="Dashboard" activeParentLink="/" activeChildLabel="Feed back" activeChildLink ="/give-feedback"/>
                <Container  maxWidth="xl" className ="app-body-content">
                    {displaySystemMessage(this.props.account.feedback)}

                    <Container component="main" maxWidth="lg">

                        <Grid container spacing={1}>
                            <Grid item xs>
                                <Paper elevation={6} className="data-container-paper">
                                    <div className ="data-container-paper-inner">
                                        <div><h3>Tell us. We are listening!</h3></div>
                                        {this.renderFeedbackForm()}
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>

                    </Container>
                </Container>

            </React.Fragment>
        )
    }

}


const  mapStateToProps = state => {
    return state;

}
export default connect(mapStateToProps , {sendFeedback})(GiveFeedback);

