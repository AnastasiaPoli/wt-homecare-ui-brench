import React, {useEffect, useState} from 'react';
import {Button, Card, CardContent, Grid, makeStyles, MenuItem} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {renderTextArea, renderTextFieldEdit, renderTextFieldSelect} from '../../util/WtFields';
import {addCommunity, updateCommunity} from './CommunityReducer';
import {validationSchema} from './Validate';
// import { values } from 'lodash';

const useStyles = makeStyles((theme) => ({
    marginBottom: {
        marginBottom: theme.spacing(2)
    }
}));

export default function CommunityForm({community}) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const {response} = useSelector((state) => state.community);
    const [btnPressState,setBtnPressState] = useState(false);
    // const [charLimit, setCharLimit] = useState(2);
    const [descriptionCharLimit,setdescriptionCharLimit] = useState(50);
    const [contentValue, setContentValue] = useState('');

    const handleChange  = e => {
        console.log(e.nativeEvent.data);
        setContentValue(contentValue => e.nativeEvent.data);
    };

    const [initialState, setInitialState] = useState({
        cid: null,
        companyId: null,
        communityName: '',
        communityCountry: '',
        communityState: '',
        communityCity: '',
        communityStreet: '',
        communityAddress: '',
        communityZipCode: '',
        communityDescription: '',
        lat: '',
        lng: ''
    });


    const countryList = require('country-list');

    let _countryNames = [];
    _countryNames.push("United States of America");
    _countryNames.push("Canada");
    countryList.getNames().map((country) => {
        if (country !== "United States of America" && country !== "Canada") {
            _countryNames.push(country);
        }
        
        return country;
    })

    const submitForm = (data) => {
        if (data.cid) {                   
            dispatch(updateCommunity(data));
            setBtnPressState(true) ;
        } else {
            dispatch(addCommunity(data));
            setBtnPressState(true) 
        }
    };

    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (response != null) {
            if (response.statusCode === 'OK') {
                history.push('/healthcare/community');
            } else {
                setShowError(true);
            }
        }
      
    }, [response]);

    return (
        <React.Fragment>
            {showError && (
                <Alert severity="error" className={classes.marginBottom} onClose={() => setShowError(false)}>
                    {response.message}
                </Alert>
            )}
            {btnPressState && (
                <Alert severity="success" className={classes.marginBottom} onClose={() => setBtnPressState(false)}>
                    Data add successfully.
                </Alert>
            )}
            <Card>
                <CardContent>
                    <Formik
                        initialValues={community || initialState}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => submitForm(values)}
                    >
                        {() => (
                            <Form autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityName" label="Name *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityCountry" label="Country *" component={renderTextFieldSelect}>
                                            {_countryNames.map((country) => (
                                                <MenuItem key={country} value={country}>
                                                    {country}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityState" label="State *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityCity" label="City *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityStreet" label="Street *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityZipCode" label="Zip Code"
                                               component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Field name="communityAddress" label="Address" component={renderTextFieldEdit}/>
                                    </Grid>
                                    
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Field name="communityDescription" label="Description *" inputProps={{ maxLength: 50 }} component={renderTextArea} />
                                    </Grid>
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Grid container spacing={5} justify="center">
                                            <Grid item xl={10} md={10} xs={10}>
                                                <Grid container spacing={9} justify="center">
                                                    <Grid item>
                                                        <Button variant="contained" color="default" component={Link}
                                                                to={'/healthcare/community'}>
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button variant="contained" color="primary" type="submit">
                                                            Save Information
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xl={2} md={2} xs={2}>
                                                    <h2 style={{fontSize:"10px"}}>remaining: {`${descriptionCharLimit} `}</h2>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
