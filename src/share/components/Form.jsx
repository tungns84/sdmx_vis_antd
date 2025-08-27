import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Input, Alert } from '@sis-cc/dotstatsuite-visions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  containerSubmitButton: {
    margin: theme.spacing(1, 0),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  alertMessage: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: 0,
  },
  close: {
    alignItems: 'flex-start',
  },
}));

const Form = ({
  email = '',
  action,
  labels,
  notification,
  closeNotificationPanel,
  isPending,
}) => {
  const [emailHasError, setEmailError] = React.useState(false);
  const [mail, setMail] = React.useState(email);
  const classes = useStyles();

  const onSubmit = () => {
    if (R.or(R.equals(mail, ''), R.not(R.includes('@', mail)))) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    action(mail);
  };

  if (notification?.open) {
    return (
      <Alert
        classes={{ action: classes.close }}
        variant="filled"
        severity={notification?.severity}
        onClose={closeNotificationPanel}
      >
        <div className={classes.alertMessage}>
          <Typography variant="body2">{notification?.message}</Typography>
        </div>
      </Alert>
    );
  }
  const emailLabel = R.prop('email', labels);
  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Input
          inputProps={{
            'aria-label': emailLabel,
            autoComplete: 'email',
          }}
          className={classes.input}
          label={emailLabel}
          type="email"
          value={mail}
          onChange={setMail}
          variant="outlined"
          fullWidth
          isControlled
          textFieldProps={{ error: emailHasError }}
          onSubmit={onSubmit}
        />
      </Grid>
      <Grid item xs={12} className={classes.containerSubmitButton}>
        <Button
          aria-label={R.propOr('', 'submit')(labels)}
          type="submit"
          disabled={isPending}
          variant="contained"
          color="primary"
          alternative="siscc"
          onClick={onSubmit}
          className={classes.submitButton}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            labels?.submit
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

Form.propTypes = {
  email: PropTypes.string,
  action: PropTypes.func,
  closeNotificationPanel: PropTypes.func,
  notification: PropTypes.shape({
    open: PropTypes.bool,
    severity: PropTypes.string,
    message: PropTypes.string,
  }),
  isPending: PropTypes.bool,
  labels: PropTypes.shape({
    submit: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    email: PropTypes.string,
  }),
};

export default Form;
