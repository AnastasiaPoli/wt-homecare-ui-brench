import React from "react";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import VitalTable from "./VitalTable";
import VitalView from "./VitalView";
import ErrorIcon from "@material-ui/icons/Error";
import { renderDatePicker } from "../../util/WtFields";
import { Field, Form, Formik } from "formik";

import {
  makeStyles,
  Button,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";

const AddResidentButton = () => (
  <Grid container justify="center">
    <Grid item>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<AddIcon />}
        component={Link}
        to="/healthcare/vital/add"
        style={{
          backgroundColor: "#015478",
          color: "#ffffff",
          margin: "1rem 0",
        }}
      >
        Add vital
      </Button>
    </Grid>
  </Grid>
);

const useStyles = makeStyles((theme) => ({
  btn_container: {
    textAlign: "center",
  },
  typography: {
    color: "#015478",
  },
  error_icon: {
    marginRight: "5px",
    color: "#015478",
  },
  topDivider: {
    margin: "1rem 0 3rem 0",
  },
  bottomDivider: {
    margin: "3rem 0 1rem 0",
  },
}));

function ResidentHome() {
  const classes = useStyles();

  return (
    <div>
      <h1>Manage Vitals</h1>

      <VitalView />

      <Divider className={classes.topDivider} />
      <Formik
        initialValues={{
          startDate: "",
          endDate: "",
        }}
      >
        {({ handleSubmit, values }) => {
          return (
            <Form className={classes.form}>
              <Grid container spacing={2} justify="space-between">
                <Grid item xl={4} md={4} xs={12}>
                  <Field
                    name="startDate"
                    label="Start"
                    component={renderDatePicker}
                  />
                </Grid>
                <Grid item xl={4} md={4} xs={12}>
                  <Field
                    name="endDate"
                    label="End"
                    component={renderDatePicker}
                  />
                </Grid>
                <Grid
                  item
                  xl={4}
                  md={4}
                  xs={12}
                  className="d-flex align-items-center"
                >
                  <ErrorIcon className={classes.error_icon} />
                  <Typography className={classes.typography}>
                    To search for specific date, enter same date for start and
                    end
                  </Typography>
                </Grid>

                <Grid
                  item
                  xl={12}
                  md={12}
                  xs={12}
                  className={classes.btn_container}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "#015478",
                      color: "#ffffff",
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>

      <Divider className={classes.bottomDivider} />

      <div className="d-flex justify-content-center">
        <AddResidentButton />{" "}
      </div>
      <VitalTable />
      <div className="d-flex justify-content-center">
        <AddResidentButton />
      </div>
    </div>
  );
}

export default ResidentHome;
