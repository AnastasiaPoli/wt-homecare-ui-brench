import React from 'react';

import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';

import Topbar from '../components/top-navigation/Topbar';
import { getPermissions, getSubscription, getUserProfile } from '../components/helpers/UserInfo';
import BreadCrumb from '../components/top-navigation/BreadCrumb';

class HealthcareSettings extends React.Component {
  componentDidMount() {
    let sub = getSubscription();
    let permissions = getPermissions();
    console.log('subscrition is --> ', sub, 'Permission is --->', permissions);
  }

  render() {
    let permissions = getPermissions();
    return (
      <React.Fragment>
        <Topbar permissions={getPermissions()} role={getUserProfile()} />
        <BreadCrumb
          activeParentLabel="Dashboard"
          activeParentLink="/dashboard"
          activeChildLabel="Healthcare Settings"
          activeChildLink="/healthcare-settings"
        />
        <Container maxWidth="xl" className="app-body-content">
          <Container component="main" maxWidth="lg">
            <h1>Any settings specific to the healthcare module</h1>
          </Container>
        </Container>
      </React.Fragment>
    );
  }
}

const mapSystemMessagesToProps = (state) => {
  return state;
};
export default connect(mapSystemMessagesToProps, {})(HealthcareSettings);
