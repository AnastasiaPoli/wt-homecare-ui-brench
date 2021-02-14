import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { fetchVital } from "./VitalReducer";
import Spinner from "../../util/Spinner";

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
  slider_img: {
    width: "120px",
  },
  carousel_item: {
    textAlign: "center",
  },
}));

export default function VitalView({ id }) {
  // const { id } = useParams();
  const dispatch = useDispatch();
  const { VITAL, LOAD_DATA } = useSelector((state) => state.vital);
  const classes = useStyles();

  useEffect(() => {
    if (id) {
      dispatch(fetchVital(id));
    }
  }, []);

  if (LOAD_DATA) return <Spinner loading={LOAD_DATA} />;

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Grid spacing={2} container>
            <Grid item xl={8} md={8} xs={12}>
              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>Name: {`static`}</Typography>
                <Typography>Date of Birth: {"static"}</Typography>
                <Typography>Gender: {"static"}</Typography>
              </Grid>

              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>Date of intake: {"static"}</Typography>
              </Grid>

              <Grid
                container
                className={classes.marginBottom}
                justify="space-between"
              >
                <Typography>Community: {"static"}</Typography>
                <Typography>Group: {"static"}</Typography>
                <Typography>Medical conditions: {"static"}</Typography>
              </Grid>

              <Grid container className={classes.marginBottom}>
                <Typography>Notes: {"static"}</Typography>
              </Grid>
            </Grid>

            <Grid
              className={classes.image_container}
              item
              xl={4}
              md={4}
              xs={12}
            >
              <img className={classes.image} src={DEFAULT_IMAGE} alt="..." />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

{
  /* <React.Fragment>
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
</React.Fragment> */
}
