import React, {useEffect, useState} from 'react';
import {Button, Card, CardContent, Grid, makeStyles, MenuItem} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {renderTextArea, renderTextFieldEdit, renderTextFieldSelect} from '../../util/WtFields';
import {addGroup, updateGroup} from './GroupReducer';
import {fetchCommunityList} from '../community/CommunityReducer';
import {validationSchema} from './Validate'

const useStyles = makeStyles((theme) => ({
    marginBottom: {
        marginBottom: theme.spacing(2)
    }
}));

export default function GroupForm({group}) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const {response} = useSelector((state) => state.group);

    const {communityList} = useSelector((state) => state.community);
    useEffect(() => dispatch(fetchCommunityList()), []);

    const [initialState, setInitialState] = useState({
        hgid: null,
        cid: null,
        companyId: null,
        groupName: '',
        groupCountry: '',
        groupState: '',
        groupCity: '',
        groupStreet: '',
        groupZipCode: '',
        groupDescription: '',
        lat: '',
        lng: ''
    });

    const [charLimit, setLimitValue] = useState(50);
    const [contentValue, setContentValue] = useState('');

    const handleChange = event => {
        setLimitValue(charLimit => (50- event.target.value.length));
        setContentValue(contentValue => event.target.value);
    };

    
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
        if (data.hgid) {
            dispatch(updateGroup(data));
        } else {
            dispatch(addGroup(data));
        }
    };

    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (response != null) {
            if (response.statusCode === 'OK') {
                history.push('/healthcare/group');
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
                        initialValues={group || initialState}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => submitForm(values)}
                    >
                        {() => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="groupName" label="Name *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="cid" label="Community *" component={renderTextFieldSelect}>
                                            {communityList.map((community) => (
                                                <MenuItem key={community.cid} value={community.cid}>
                                                    {community.communityName}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="groupCountry" label="Country *" component={renderTextFieldSelect}>
                                        {                                       
                                            _countryNames.map((country) => (
                                                <MenuItem key={country} value={country}>
                                                    {country}
                                                </MenuItem>
                                            ))                                           
                                        }
                                        </Field>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="groupState" label="State *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="groupCity" label="City *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="groupStreet" label="Street *" component={renderTextFieldEdit}/>
                                    </Grid>
                                    <Grid item xl={6} md={6} xs={12}>
                                        <Field name="groupZipCode" label="Zip Code" component={renderTextFieldEdit}/>
                                    </Grid>
                                   
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Field name="groupDescription" label="Description *" value = {contentValue} component={renderTextArea} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xl={12} md={12} xs={12}>
                                        <Grid container spacing={5} justify="center">
                                            <Grid item xl={10} md ={10} xs={10}>
                                                <Grid container spacing={9} justify="center">
                                                    <Grid item>
                                                        <Button variant="contained" color="default" component={Link}
                                                                to={'/healthcare/group'}>
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
                                                <h2 style={{fontSize:"14px"}}>Remaining:{charLimit}</h2>
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
