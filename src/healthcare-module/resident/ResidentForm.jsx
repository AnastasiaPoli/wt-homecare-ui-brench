import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  MenuItem,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik, FieldArray } from "formik";
import {
  renderTextArea,
  renderTextFieldEdit,
  renderDatePicker,
  renderTextFieldSelect,
} from "../../util/WtFields";
import {
  addResident,
  updateResident,
} from "../../healthcare-module/resident/ResidentReducer";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { fetchResidentList } from "./ResidentReducer";
import { validationSchema } from "./Validate";
import { _getImageFileToBase64 } from "./../../components/helpers/Functions";
import DEFAULT_IMAGE from "../../images/default_img.svg";

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  flex: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  marginTop: {
    marginTop: "1rem",
  },
  button_container: {
    textAlign: "center",
    marginTop: "1rem",
  },
  button: {
    backgroundColor: "#015478",
    color: "#ffffff",
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  image_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1rem",
  },
  image: {
    width: "70%",
    minWidth: "165px",
    minHeight: "135px",
  },
  uploadButtom: {
    width: "50%",
    marginTop: "1rem",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  advance: {
    display: "flex",
    alignItems: "center",
  },
  file_input: {
    display: "none",
  },
  custom_btn: {
    width: "118px",
    height: "36px",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "uppercase",
    color: "white",
    background: "#015478",
    marginTop: "1rem",
  },
}));

const groupList = [
  { id: 1, name: "group 1" },
  { id: 2, name: "group 2" },
  { id: 3, name: "group 3" },
];
const maritalStatusList = ["Y", "N", "D"];
const genderList = ["Male", "Female", "Other"];

export default function ResidentForm({ resident }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  console.log("resident", resident);

  const { response } = useSelector((state) => state.resident);

  console.log(resident);

  useEffect(() => dispatch(fetchResidentList()), []);

  const [condition, setCondition] = useState("");

  const [initialState, setInitialState] = useState({
    pain: null,
    homeAddress: "test home address",
    firstName: "",
    lastName: "",
    otherNames: "",
    dob: "15/05/2021",
    maritalStatus: "",
    gender: "",
    emergencyContactPhone: "",
    emergencyContactName: "",
    knownHealthIssues: "",
    governmentId: "",
    specialNotes: "",
    residentPhoto: "",
  });

  const submitForm = (data) => {
    if (data.pain) {
      // data.dob = data.dob.split("-").reverse().join("/");
      dispatch(updateResident(data));
    } else {
      // data.dob = data.dob.split("-").reverse().join("/");
      dispatch(addResident(data));
    }
  };

  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (response != null) {
      if (response.statusCode === "OK") {
        history.push("/healthcare/resident");
      } else {
        setShowError(true);
      }
    }
  }, [response]);

  useEffect(() => {
    if (resident) {
      setInitialState((initialState) => ({
        ...initialState,
        pain: resident?.pain,
        // dob: resident?.dob.split("/").reverse().join("-"),
      }));
    }
  }, [resident]);

  return (
    <React.Fragment>
      {showError && (
        <Alert
          severity="error"
          className={classes.marginBottom}
          onClose={() => setShowError(false)}
        >
          {response.message}
        </Alert>
      )}
      <Card>
        <CardContent>
          <Formik
            initialValues={resident || initialState}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={(values) => submitForm(values)}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form>
                  <Grid container>
                    <Grid item xl={8} md={8} xs={12}>
                      <Grid item className={classes.flex}>
                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="firstName"
                            label="First Name"
                            component={renderTextFieldEdit}
                          />
                        </Grid>

                        <Grid
                          item
                          className={classes.marginTop}
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="lastName"
                            label="Last Name"
                            component={renderTextFieldEdit}
                          />
                        </Grid>
                      </Grid>

                      <Grid item className={classes.flex}>
                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="otherNames"
                            label="Other Names"
                            component={renderTextFieldEdit}
                          />{" "}
                        </Grid>

                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="dob"
                            label="Date Of Birth"
                            component={renderDatePicker}
                            // format="dd/mm/yyyy"
                            // format="DD-MM-YYYY"
                          />
                        </Grid>
                      </Grid>

                      <Grid item className={classes.flex}>
                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="hgid"
                            label="Group"
                            component={renderTextFieldSelect}
                          >
                            {groupList.map((group) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="maritalStatus"
                            label="Marital Status"
                            component={renderTextFieldSelect}
                          >
                            {maritalStatusList.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status === "Y"
                                  ? "Married"
                                  : status === "D"
                                  ? "Divorced"
                                  : "Single"}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                      </Grid>

                      <Grid item className={classes.flex}>
                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="gender"
                            label="Gender"
                            component={renderTextFieldSelect}
                          >
                            {genderList.map((gender) => (
                              <MenuItem key={gender} value={gender}>
                                {gender}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="emergencyContactPhone"
                            label="Emergency Contact Phone"
                            component={renderTextFieldEdit}
                          />
                        </Grid>
                      </Grid>

                      <Grid item className={classes.flex}>
                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="emergencyContactName"
                            label="Emergency Contact Person"
                            component={renderTextFieldEdit}
                          />
                        </Grid>

                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <p>Known Medical Condition</p>

                          <Field
                            name="knownHealthIssues"
                            label="Medical Condition"
                            component={renderTextFieldEdit}
                          />

                          {/* {!!values?.knownHealthIssues?.length &&
                            values.knownHealthIssues.map((condition, index) => (
                              <>
                                <span>
                                  {condition}
                                </span>

                                <span
                                  onClick={() =>
                                    setInitialState((initialState) => {
                                      let newArr =
                                        initialState.knownHealthIssues;
                                      newArr.splice(
                                        index,
                                        1
                                      )({
                                        ...initialState,
                                        knownHealthIssues: newArr,
                                      });
                                    })
                                  }
                                >
                                  <DeleteIcon />
                                </span>
                                <br />
                              </>
                            ))}

                          <Field
                            label="Medical Condition"
                            component={renderTextFieldEdit}
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                          />
                          <span
                            onClick={() =>
                              setInitialState((initialState) => ({
                                ...initialState,
                                knownHealthIssues: [
                                  ...initialState.knownHealthIssues,
                                  condition,
                                ],
                              }))
                            }
                          >
                            <AddCircleIcon />
                          </span> */}
                        </Grid>
                      </Grid>

                      <Grid item className={classes.flex}>
                        <Grid
                          className={classes.marginTop}
                          item
                          xl={5}
                          md={5}
                          xs={12}
                        >
                          <Field
                            name="governmentId"
                            label="Government ID"
                            component={renderTextFieldEdit}
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        className={classes.marginTop}
                        direction="column"
                      >
                        <Grid item>
                          <Field
                            name="specialNotes"
                            label="Note"
                            component={renderTextArea}
                          />
                        </Grid>

                        <Grid item className={classes.button_container}>
                          <Button
                            className={classes.button}
                            style={{
                              backgroundColor: "#015478",
                              color: "#ffffff",
                            }}
                            onClick={handleSubmit}
                          >
                            Save Information
                          </Button>
                        </Grid>
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
                        src={values.residentPhoto || DEFAULT_IMAGE}
                        alt="..."
                      />

                      <label className={classes.custom_btn}>
                        <input
                          id="file"
                          type="file"
                          className={classes.file_input}
                          name="residentPhoto"
                          // onChange={async (e) => {
                          //   const base64 = await _getImageFileToBase64(
                          //     e.target.files[0]
                          //   );
                          //   setInitialState((initialState) => ({
                          //     ...initialState,
                          //     residentPhoto: base64,
                          //   }));
                          // }}
                        />
                        Upload
                      </label>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
