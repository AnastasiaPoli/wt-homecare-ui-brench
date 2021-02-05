import React from 'react';
import { Container, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { NavLink, Switch } from 'react-router-dom';

import Topbar from '../components/top-navigation/Topbar';
import { getPermissions, getUserProfile } from '../components/helpers/UserInfo';
import BreadCrumb from '../components/top-navigation/BreadCrumb';
import { PrivateRoute } from '../Routes';
import HealthcareDashboard from './dashboard/HealthcareDashboard';
import ResidentHome from './resident/ResidentHome';
import ResidentAdd from './resident/ResidentAdd';
import GroupList from './group/GroupList';
import GroupAdd from './group/GroupAdd';
import GroupEdit from './group/GroupEdit';
import CommunityList from './community/CommunityList';
import CommunityAdd from './community/CommunityAdd';
import CommunityEdit from './community/CommunityEdit';
import HealthcareReportHome from './report/HealthcareReportHome';
import ReactLogo from '../images/u47.svg'
import '../App.css'

export const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  content: {
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: drawerWidth,
    position: 'relative'
  },
  drawerContainer: {
    overflow: 'auto'
  },
  img: {
    margin: '50px'
  }
}));

export default function HealthcareHome() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Topbar permissions={getPermissions()} role={getUserProfile()} />


      <div className={classes.root}>
        <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawerPaper }}>
          <div className={classes.drawerContainer}>
            <List>
              <ListItem >
                <img width={100} height={120} src={ReactLogo} className="img-adjust-container" />
              </ListItem>
              <ListItem button component={NavLink} to="/healthcare/resident">
                <ListItemText className={"nav-left-menutext-color"} primary="Manage Residents" />
              </ListItem>
              <ListItem button component={NavLink} to="/healthcare/group">
                <ListItemText className={"nav-left-menutext-color"} primary="Manage Groups" />
              </ListItem>
              <ListItem button component={NavLink} to="/healthcare/community">
                <ListItemText className={"nav-left-menutext-color"} primary="Manage Communities" />
              </ListItem>
              <ListItem button component={NavLink} to="/healthcare/report">
                <ListItemText className={"nav-left-menutext-color"} primary="Reports" />
              </ListItem>
            </List>
          </div>
        </Drawer>

        <div className={classes.content}>
          <Container maxWidth="xl" className="app-body-content">
            <Container component="main" maxWidth="lg">
              <Switch>
                <PrivateRoute exact path="/healthcare" component={HealthcareDashboard} />
                <PrivateRoute path="/healthcare/resident" component={ResidentHome} />

                <PrivateRoute exact path="/healthcare/group" component={GroupList} />
                <PrivateRoute exact path="/healthcare/group/add" component={GroupAdd} />
                <PrivateRoute exact path="/healthcare/group/:id/edit" component={GroupEdit} />

                <PrivateRoute exact path="/healthcare/community" component={CommunityList} />
                <PrivateRoute exact path="/healthcare/community/add" component={CommunityAdd} />
                <PrivateRoute exact path="/healthcare/community/:id/edit" component={CommunityEdit} />

                <PrivateRoute path="/healthcare/report" component={HealthcareReportHome} />
              </Switch>
            </Container>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
}
