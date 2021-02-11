import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardActionArea, CardActions, CardContent, Container, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Topbar from '../components/top-navigation/Topbar';
import { getPermissions, getUserProfile } from '../components/helpers/UserInfo';

class Dashboard extends React.Component {
  componentDidMount() {
    // let sub = getSubscription();
    // let permissions = getPermissions();
    // console.log('subscrition is --> ', sub, 'Permission is --->', permissions);
  }

  render() {
    // let permissions = getPermissions();
    return (
      <React.Fragment>
        <Topbar permissions={getPermissions()} role={getUserProfile()} />
        <Container maxWidth="xl" className="app-body-content">
          <Container component="main" maxWidth="lg">
            <h1>Welcome to Worktrim Dashboard</h1>

            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Home healthcare
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Home health provides easy and seamless way to manage your clients as well as your emaployees ...all
                    in one spot
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Link to="/healthcare">
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </Link>
                <Link to="/healthcare">
                  <Button size="small" color="primary">
                    Go To Home Healthcare
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Container>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps, {})(Dashboard);
