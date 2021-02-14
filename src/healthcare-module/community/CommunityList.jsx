import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import {
  clearResponse,
  deleteCommunity,
  fetchCommunityList,
} from "./CommunityReducer";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { compose } from "redux";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { GOOGLE_MAPS_API_KEY } from "../../components/helpers/Constants";
// import DEFAULT_IMAGE from "../../images/default_img.svg";

const useStyles = makeStyles((theme) => ({
  marginTopBottom: {
    margin: theme.spacing(2, 0),
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
}));

const MyMapComponent = compose(
  withScriptjs,
  withGoogleMap
)((props) => {
  const classes = useStyles();
  const handleEventDetails = (event) => {
    window.location.href = URL;
  };
  return (
    <GoogleMap defaultZoom={8} defaultCenter={props.defaultCenter}>
      {props.markers.map((marker, index) => (
        <Marker
          key={"marker-" + index}
          onClick={() => props.handleClick(marker)}
          position={{ lat: marker.lat, lng: marker.lng }}
        >
          {props.selectUser === marker && (
            <InfoWindow
              options={{ closeBoxURL: ``, enableEventPropagation: true }}
            >
              <Card
                className={clsx(classes.card)}
                key={index}
                onClick={() => handleEventDetails(marker)}
              >
                <CardMedia className={classes.media} image={marker.imageUrl} />

                <CardContent
                  classes={{
                    root: classes.cardContent,
                  }}
                >
                  <Typography>{marker.communityName}</Typography>
                  <Typography>{marker.communityAddress}</Typography>
                </CardContent>
              </Card>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
});

export default function CommunityList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [lat, setLat] = useState(-34.397);
  const [lng, setLng] = useState(150.644);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectUser, setSelectUser] = useState("");
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowInfoWindow(true);
    setSelectUser(event);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectUser("");
  };

  const { communityList, response } = useSelector((state) => state.community);

  const columns = [
    {
      name: "communityName",
      label: "Community Name",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "communityDescription",
      label: "Description",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "communityAddress",
      label: "Address",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "cid",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        print: false,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080", textAlign: "center" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Grid container spacing={1} justify="center">
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  component={Link}
                  to={`/healthcare/community/${value}/edit`}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  style={{ color: "#ffffff", backgroundColor: "#D9001B" }}
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteCommunity(value)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          );
        },
      },
    },
  ];
  const options = {
    filter: true,
    filterType: "dropdown",
    selectableRows: "none",
    print: true,
    responsive: "standard",
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
  };

  useEffect(() => dispatch(fetchCommunityList()), []);

  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (response != null && response.statusCode === "OK") {
      setShowSuccess(true);
      setMessage(response.message);
      dispatch(clearResponse());
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [response]);

  const [community, setCommunity] = useState(null);
  const handleDeleteCommunity = (id) => {
    setCommunity(communityList.find((community) => community.cid === id));
    setDialogOpen(true);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogApply = () => {
    dispatch(deleteCommunity(community.cid));
    setDialogOpen(false);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const c = position.coords;
          const latitude = c.latitude;
          const longitude = c.longitude;
          setLat(latitude);
          setLng(longitude);
        });
        return true;
      }
    };
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddCommunityButton = () => (
    <Grid container justify="center">
      <Grid item>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/healthcare/community/add"
        >
          Add Community
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <React.Fragment>
      <h1>Manage Communities</h1>
      {showSuccess && (
        <Alert
          severity="success"
          className={classes.marginBottom}
          onClose={() => setShowSuccess(false)}
        >
          {message}
        </Alert>
      )}

      <Grid container>
        <AddCommunityButton />
      </Grid>

      <MUIDataTable
        title={"Community List"}
        data={communityList}
        columns={columns}
        options={options}
        className={classes.marginTopBottom}
      />

      <Grid container style={{ marginTop: "10px", marginBottom: "20px" }}>
        <AddCommunityButton />
      </Grid>

      <MyMapComponent
        handleClick={handleClick}
        selectUser={selectUser}
        showInfoWindow={showInfoWindow}
        handleClose={handleClose}
        anchorEl={anchorEl}
        mapElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `80vh` }} />}
        loadingElement={<div style={{ height: `100%` }} />}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`}
        markers={communityList || []}
        defaultCenter={{
          lat: lat,
          lng: lng,
        }}
      />

      {community && (
        <DeleteConfirmation
          name={community.communityName}
          open={dialogOpen}
          onApply={handleDialogApply}
          onClose={handleDialogClose}
        />
      )}
    </React.Fragment>
  );
}
