import React, {useEffect, useState} from 'react';
import {Button, Card, CardContent, Grid, makeStyles, MenuItem} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {renderTextArea, renderTextFieldEdit, renderTextFieldSelect} from '../../util/WtFields';
import {addCommunity, updateCommunity} from './CommunityReducer';
import {validationSchema} from './Validate'

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

    useEffect(() => {
        const fetchLocation = async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const c = position.coords;
                    const latitude = c.latitude;
                    const longitude = c.longitude;
                    setInitialState({
                        ...initialState,
                        lat: latitude,
                        lng: longitude
                    })
                });
                return true;
            }
        };
        fetchLocation().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const countryList = require('country-list');


    const submitForm = (data) => {
        if (data.cid) {
            dispatch(updateCommunity(data));
        } else {
            dispatch(addCommunity(data));
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
            <Card>
                <CardContent>
                    <Formik
                        initialValues={community || initialState}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => submitForm(values)}
                    >
                        {() => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityName" label="Name *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="communityCountry" label="Country *"
                                               component={renderTextFieldSelect}>
                                            {countryList.getNames().map((country) => (
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
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="lat" label="Latitude" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="lng" label="Longitude" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Field name="communityDescription" label="Description *"
                                               component={renderTextArea}/>
                                    </Grid>
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Grid container spacing={2} justify="center">
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
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
