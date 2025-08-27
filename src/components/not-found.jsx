import React from 'react';
import Page from './Page';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(8),
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Page id="notFound">
      <Grid container direction="column" className={classes.wrapper}>
        <Grid item container justifyContent="center">
          <Typography variant="h6" align="center">
            Page not found
          </Typography>
        </Grid>
      </Grid>
    </Page>
  );
};

export default NotFound;
