import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { clearResponse, deleteVital, fetchVitalList } from "./VitalReducer";
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Alert from "@material-ui/lab/Alert";
import DEFAULT_IMAGE from "../../images/default_img.svg";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: ".75rem",
      maxWidth: 280,
    },
  },

  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  img: {
    width: "50%",
  },
}));

function VitalTable() {
  const { id } = useParams();


  const dispatch = useDispatch();

  const { vitalList, response } = useSelector((state) => state.vital);

  console.log("vitalList", vitalList);

  // useEffect(() => dispatch(fetchVitalList()), []);
  useEffect(() => {
    if (id) {
      dispatch(fetchVitalList(id));
    }
  }, []);


  const [vital, setVital] = useState(null);

  const handleDeleteGroup = (id) => {
    setVital(vitalList.find((vital) => vital.pain === id));
    setDialogOpen(true);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogApply = () => {
    dispatch(deleteVital(vital.pain));
    setDialogOpen(false);
  };

  const rows = [
    {
      id: 1,
      Photo: "image",
      name: "Johan With",
      group: "Lakeside flats",
      Action: "dekect",
    },
    {
      id: 2,
      Photo: "image",
      name: "Johan With",
      group: "Lakeside flats",
    },
  ];
  const classes = useStyles();

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

  const columns = [
    {
      name: "reportedDate",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "reportedTime",
      label: "Time",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "pulse	",
      label: "Pulse",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "bloodSugar",
      label: "Blood Sug.",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "temperature",
      label: "Temperature",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },
    {
      name: "bloodPressure",
      label: "Blood pressure",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: (value) => ({
          style: { fontWeight: "bold", color: "#008080" },
        }),
      },
    },

    {
      name: "pain",
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
                  color="secondary"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  component={Link}
                  to={`/healthcare/vital/${value}/view`}
                >
                  View
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  component={Link}
                  to={`/healthcare/vital/${value}/edit`}
                >
                  Edit
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="outlined"
                  color="#ff0000"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteGroup(value)}
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

  return (
    <React.Fragment>
      {showSuccess && (
        <Alert
          severity="success"
          className={classes.marginBottom}
          onClose={() => setShowSuccess(false)}
        >
          {message}
        </Alert>
      )}

      <MUIDataTable
        title={"Vital List"}
        data={vitalList}
        columns={columns}
        options={options}
      />

      {vital && (
        <DeleteConfirmation
          name={`${vital.firstName} ${vital.lastName}`}
          open={dialogOpen}
          onApply={handleDialogApply}
          onClose={handleDialogClose}
        />
      )}
    </React.Fragment>
  );
}

export default VitalTable;
