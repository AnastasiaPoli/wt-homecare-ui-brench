import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { permissionConstants } from '../helpers/PermissionConstants';
import { getPermissions } from '../helpers/UserInfo';

class BreadCrumb extends React.Component {
  renderParentCrumb = () => {
    if (this.props.activeParentLink != null) {
      return (
        <Link to={this.props.activeParentLink} style={{ textDecoration: 'none', color: 'grey' }}>
          {this.props.activeParentLabel}
        </Link>
      );
    } else {
      return null;
    }
  };

  renderChildCrumb = () => {
    if (this.props.activeChildLink) {
      return (
        <Link to={this.props.activeChildLink} aria-current="page" style={{ textDecoration: 'none', color: 'grey' }}>
          {this.props.activeChildLabel}
        </Link>
      );
    } else {
      return null;
    }
  };

  renderSchedulesButtons = () => {
    const permissions = getPermissions();
    if (permissions.indexOf(permissionConstants.permissions.SCHEDULER_PERMISSION) >= 0) {
      let approvalsURL = 'select-department_-omp-timeclock-approvals';
      return (
        <React.Fragment>
          <Link to={approvalsURL} style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="default" style={{ marginRight: '15px' }}>
              <LibraryAddIcon /> Approvals
            </Button>
          </Link>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <Paper elevation={4} style={{ width: '100%', minHeight: '50px', borderRadius: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={3} md={3}>
            <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: '10px', marginLeft: '20px' }}>
              {this.renderParentCrumb()}
              {this.renderChildCrumb()}
            </Breadcrumbs>
          </Grid>
          <Grid item xs={9} md={9}>
            <div style={{ float: 'right', marginTop: '10px' }}></div>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default BreadCrumb;
