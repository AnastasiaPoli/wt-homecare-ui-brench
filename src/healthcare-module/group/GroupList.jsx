import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Grid, makeStyles} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {Link} from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import {clearResponse, deleteGroup, fetchGroupList} from './GroupReducer';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import {compose} from "redux";
import {GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import Card from "@material-ui/core/Card";
import clsx from "clsx";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {GOOGLE_MAPS_API_KEY} from "../../components/helpers/Constants";

const useStyles = makeStyles((theme) => ({
    marginTopBottom: {
        margin: theme.spacing(2, 0)
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    }
}));


const MyMapComponent = compose(withScriptjs, withGoogleMap)((props) => {
        const classes = useStyles();
        const handleEventDetails = (event) => {
            window.location.href = URL;
        };
        return (
            <GoogleMap defaultZoom={8} defaultCenter={props.defaultCenter}>
                {props.markers.map((marker, index) => (
                    <Marker key={"marker-" + index} onClick={() => props.handleClick(marker)}
                            position={{lat: marker.lat, lng: marker.lng}} >

                        {props.selectUser === marker &&
                        <InfoWindow options={{closeBoxURL: ``, enableEventPropagation: true}}>
                            <Card className={clsx(classes.card)} key={index} onClick={() => handleEventDetails(marker)}>
                                <CardMedia
                                    className={classes.media}
                                    image={marker.imageUrl}
                                />
                                <CardContent classes={{
                                    root: classes.cardContent
                                }}>

                                    <Typography>
                                        {marker.groupName}
                                    </Typography>
                                    <Typography>
                                        {marker.groupStreet}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </InfoWindow>
                        }
                    </Marker>
                ))}
            </GoogleMap>

        )
    }
)

export default function GroupList() {
    const classes = useStyles();
    const dispatch = useDispatch();
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectUser, setSelectUser] = useState('')
  const [showInfoWindow, setShowInfoWindow] = useState(false)
    const {groupList, response} = useSelector((state) => state.group);
    const columns = [
        {
            name: 'groupName',
            label: 'Group Name',
            options: {
                filter: true,
                sort: true,
                setCellHeaderProps: (value) => ({style: {fontWeight: 'bold', color: '#008080'}})
            }
        },
        {
            name: 'groupDescription',
            label: 'Description',
            options: {
                filter: false,
                sort: true,
                setCellHeaderProps: (value) => ({style: {fontWeight: 'bold', color: '#008080'}})
            }
        },
        {
            name: 'groupStreet',
            label: 'Street Address',
            options: {
                filter: false,
                sort: true,
                setCellHeaderProps: (value) => ({style: {fontWeight: 'bold', color: '#008080'}})
            }
        },
        {
            name: 'hgid',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                print: false,
                setCellHeaderProps: (value) => ({style: {fontWeight: 'bold', color: '#008080', textAlign: 'center'}}),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Grid container spacing={1} justify="center">
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<EditIcon/>}
                                    component={Link}
                                    to={`/healthcare/group/${value}/edit`}
                                >
                                    Edit
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="#ff0000"
                                    size="small"
                                    startIcon={<DeleteIcon/>}
                                    onClick={() => handleDeleteGroup(value)}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    );
                }
            }
        }
    ];
    const options = {
        filter: true,
        filterType: 'dropdown',
        selectableRows: 'none',
        print: true,
        responsive: 'standard',
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20, 50, 100]
    };

    useEffect(() => dispatch(fetchGroupList()), []);

    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (response != null && response.statusCode === 'OK') {
            setShowSuccess(true);
            setMessage(response.message);
            dispatch(clearResponse());
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [response]);

    const [group, setGroup] = useState(null);
    const handleDeleteGroup = (id) => {
        setGroup(groupList.find((group) => group.hgid === id));
        setDialogOpen(true);
    };
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleDialogClose = () => setDialogOpen(false);
    const handleDialogApply = () => {
        dispatch(deleteGroup(group.hgid));
        setDialogOpen(false);
    };  

    const AddGroupButton = () => (
        <Grid container justify="center">
            <Grid item>
                <Button variant="outlined" color="secondary" startIcon={<AddIcon/>} component={Link}
                        to="/healthcare/group/add" style={{backgroundColor:"#015478", color:"#ffffff"}}>
                    Add Group
                </Button>
            </Grid>
        </Grid>
    );

    const AssignResidentGroup = () => (
        <Grid container justify="center">
            <Grid item>
                <Button variant="outlined" color="default" component={Link}
                        to="/healthcare/group/add" style={{backgroundColor:"#008080", color:"#ffffff"}}>
                    Assign Residents to Group
                </Button>
            </Grid>
        </Grid>
    );

    const AssignEmployeesGroup = () => (
        <Grid container justify="center">
            <Grid item>
                <Button variant="outlined" color="default" component={Link}
                        to="/healthcare/group/add" style={{backgroundColor:"#02a7f0", color:"#ffffff"}}>
                    Assign Employees to Groups
                </Button>
            </Grid>
        </Grid>
    );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowInfoWindow(true)
    setSelectUser(event)
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectUser('')
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const c = position.coords;
          const latitude = c.latitude;
          const longitude = c.longitude;
          setLat(latitude)
          setLng(longitude)
        });
        return true;
      }
    };
    fetchLocation().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    return (
        <React.Fragment>
            <h1>Manage Groups</h1>
            {showSuccess && (
                <Alert severity="success" className={classes.marginBottom} onClose={() => setShowSuccess(false)}>
                    {message}
                </Alert>
            )}
            
            <Grid container spacing={1} justify="center">
                <Grid item xl={3} md={3} xs={3}>
                    <AddGroupButton/>
                </Grid>
                <Grid item xl={4} md={4} xs={4}>
                    <AssignResidentGroup/>
                </Grid>
                <Grid item xl={5} md={5} xs={5}>
                    <AssignEmployeesGroup/>
                </Grid>
            </Grid>            

            <MUIDataTable
                title={'Group List'}
                data={groupList}
                columns={columns}
                options={options}
                className={classes.marginTopBottom}
            />

            <Grid container spacing={1} justify="center" style={{marginTop: "10px", marginBottom: "20px"}}>
                <Grid item xl={3} md={3} xs={3}>
                    <AddGroupButton/>
                </Grid>
                <Grid item xl={4} md={4} xs={4}>
                    <AssignResidentGroup/>
                </Grid>
                <Grid item xl={5} md={5} xs={5}>
                    <AssignEmployeesGroup/>
                </Grid>
            </Grid>  
            <MyMapComponent
              handleClick={handleClick}
              selectUser={selectUser}
              showInfoWindow={showInfoWindow}
              handleClose={handleClose}

              anchorEl={anchorEl}
              mapElement={<div style={{height: `100%`}}/>}
              containerElement={<div style={{height: `80vh`}}/>}
              loadingElement={<div style={{height: `100%`}}/>}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`}
              markers={groupList || []}
              defaultCenter={{
                lat: lat,
                lng: lng
              }}
          />


            {group && (
                <DeleteConfirmation
                    name={group.groupName}
                    open={dialogOpen}
                    onApply={handleDialogApply}
                    onClose={handleDialogClose}
                />
            )}            

        </React.Fragment>
    );
}
