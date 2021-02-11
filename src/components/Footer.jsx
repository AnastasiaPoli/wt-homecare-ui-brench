import React from 'react';
import { Grid, Link, Paper } from '@material-ui/core';

export default function Footer() {
  return (
    <Grid
      item
      xs={12}
      style={{
        width: '100%',
        minHeight: '100px',
        position: 'static',
        transform: 'translateZ(0)',
        display: 'flex',
        zIndex: '1101'
      }}
    >
      <Paper
        elevation={4}
        style={{
          width: '100%',
          minHeight: '100px',
          position: 'static',
          transform: 'translateZ(0)',
          display: 'flex',
          zIndex: '1102'
        }}
      >
        <Grid container spacing={2} style={{ margin: '0px' }}>
          <Grid item xs>
            <div style={{ paddingLeft: '15px' }}>&copy; 2020 Appcentrus</div>
          </Grid>
          <Grid item xs>
            <div style={{ paddingLeft: '50%' }}>
              <Link href="#">Privacy</Link>
              <Link href="#" style={{ paddingLeft: '15px' }}>
                Terms of Use
              </Link>
              <Link href="#" style={{ paddingLeft: '15px' }}>
                Contact
              </Link>
              <Link href="#" style={{ paddingLeft: '15px' }}>
                Help
              </Link>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
