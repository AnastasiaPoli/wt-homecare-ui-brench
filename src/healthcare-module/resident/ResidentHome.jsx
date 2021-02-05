import { makeStyles, Button, Grid, Collapse } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { useState } from 'react';
import ResidentTable from './ResidentTable';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '&>div': {
        width: '100%',
        marginBottom: '.75rem'
      }
    }
  },
  input: {
    maxWidth: 330,
    width: '100%',
    marginRight: '1rem',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginRight: 0,
      '&>input': {
        maxWidth: 330
      }
    },
    '&>input': {
      height: 35,
      width: '100%',
      borderRadius: 0,
      border: '1px solid gray'
    }
  },
  gridContainer: {
    alignItems: 'center'
  },
  myLabel: {
    fontSize: 16,
    marginRight: '1rem',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      textAlign: 'start'
    }
  },
  button: {
    backgroundColor: 'rgba(0, 191, 191, 1)',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '.75rem',
      maxWidth: 280,

    }
  },
  advance: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2rem'
  },
  advanceDiv: {
    maxWidth: 550,
    width: '100%',
    padding: '1rem 1.5rem',
    border: '1px solid rgba(143, 140, 140, 0.7)',
    marginBottom:'1.5rem'

  },
  advanceDate: {
    height: 35,
    maxWidth: 280,
    width: '100%'
  },
  mt_5: {
    marginTop: '2.5rem'
  },
  mt_3: {
    marginTop: '1.5rem'
  }
}))
function ResidentHome() {
  const classes = useStyles()
  const [searchBox, setSearchBox] = useState(false)
  return (
    <div>
      <h1>Manage Residents</h1>
      <div className={classes.root}>
        <div className={classes.myLabel}>
          Resident ID:
        </div>
        <div className={classes.input}>
          <input type="text" />
        </div>
        <div>
          <Button variant="contained" color="primary" className={classes.button}>
            Search
          </Button>
        </div>
      </div>
      <div className={classes.advance}>
        <div className='f16'>
          Advanced Search
</div>
        <button className='btn' onClick={() => setSearchBox(!searchBox)}>
          <AddCircleIcon />
        </button>
      </div>
      <Collapse in={searchBox} className={classes.advanceDiv}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={4}>
            <div className="f16">
              Date of intake
          </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <input type="date" name='advanceDate' className={classes.advanceDate} />

          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="center" className={classes.mt_3}>
          <Grid item xs={12} sm={4}>
            <div className="f16">
              Resident's Name
          </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <input type="text" placeholder='First Name' className={classes.advanceDate} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <input type="text" placeholder='Last Name' className={classes.advanceDate} />
          </Grid>
        </Grid>
        <Grid container spacing={3} justify='center' alignItems="center">
          <Grid item xs={12} sm={8}>
            <Button variant="contained" color="primary" className={`${classes.button} ${classes.mt_5} w-100`}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Collapse>

      <div className='d-flex justify-content-center'>
        <Button variant='contained' color='primary' style={{backgroundColor:'rgba(1, 84, 120, 1)'}}>
          + Add resident
        </Button>
      </div>
      <ResidentTable/>
    </div>
  )
}

export default ResidentHome
