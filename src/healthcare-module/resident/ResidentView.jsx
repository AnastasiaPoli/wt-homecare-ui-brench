import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchResident } from "./ResidentReducer";
import Spinner from "../../util/Spinner";
import Carousel from "../../components/common/carousel";

import DEFAULT_IMAGE from "../../images/default_img.svg";

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  image_container: {
    textAlign: "center",
  },
  image: {
    width: "70%",
  },
  // cart_nested_containers :{
  //   textAlign:'ce'
  // }
}));

export default function ResidentView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { RESIDENT, LOAD_DATA } = useSelector((state) => state.resident);
  const classes = useStyles();

  useEffect(() => {
    if (id) {
      dispatch(fetchResident(id));
    }
  }, []);

  // useEffect(() => {
  //   console.log("=====================", RESIDENT);
  // }, [RESIDENT]);

  if (LOAD_DATA) return <Spinner loading={LOAD_DATA} />;

  return (
    <React.Fragment>
      <h1>View Resident</h1>
      <Card>
        <CardContent>
          <Grid spacing={2} container>
            <Grid item xl={8} md={8} xs={12}>
              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>
                  Name: {`${RESIDENT?.firstName} ${RESIDENT?.lastName}`}
                </Typography>
                <Typography>Date of Birth: {RESIDENT?.dob}</Typography>
                <Typography>Gender: {RESIDENT?.gender}</Typography>
              </Grid>

              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>
                  Marital Status:{" "}
                  {`${RESIDENT?.firstName} ${RESIDENT?.lastName}`}
                </Typography>
                <Typography>Official ID: {"static"}</Typography>
                <Typography>
                  Date of intake: {RESIDENT?.dateOfIntake}
                </Typography>
              </Grid>

              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>Community: {"static"}</Typography>
                <Typography>Group: {"static"}</Typography>
                <Typography>
                  Medical conditions: {RESIDENT?.knownHealthIssues}
                </Typography>
              </Grid>

              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>
                  Emergency Contact Person: {RESIDENT?.emergencyContactName}
                </Typography>
                <Typography>
                  Emergency Contact Phone: {RESIDENT?.emergencyContactPhone}
                </Typography>
              </Grid>

              <Grid container className={classes.marginBottom}>
                <Typography>Notes: {RESIDENT?.specialNotes}</Typography>
              </Grid>
            </Grid>

            <Grid
              className={classes.image_container}
              item
              xl={4}
              md={4}
              xs={12}
            >
              <img
                className={classes.image}
                src={RESIDENT?.residentPhoto || DEFAULT_IMAGE}
                alt="..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid spacing={2} container>
            <Grid justify="center" container>
              <Typography color="primary" variant="h5" gutterBottom>
                Medication Chart
              </Typography>

              {/* <Carousel>
                <img
                  className={classes.image}
                  src={RESIDENT?.residentPhoto || DEFAULT_IMAGE}
                  alt="..."
                />
                <img
                  className={classes.image}
                  src={RESIDENT?.residentPhoto || DEFAULT_IMAGE}
                  alt="..."
                />
                <img
                  className={classes.image}
                  src={RESIDENT?.residentPhoto || DEFAULT_IMAGE}
                  alt="..."
                />
              </Carousel> */}
            </Grid>

            <Grid justify="center" container>
              <Typography color="primary" variant="h5" gutterBottom>
                Vitals
              </Typography>
            </Grid>

            <Grid justify="center" container>
              <Typography color="primary" variant="h5" gutterBottom>
                Incidents
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
