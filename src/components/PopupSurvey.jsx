import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import makeStyles from '@mui/styles/makeStyles';
import { FormattedMessage } from '../i18n';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 1, 0, 0),
    backgroundColor: '#0660EF',
    width: '700px',
    height: '550px',
  },
  text: {
    width: '65%',
    fontFamily: 'Noto Sans Display, sans-serif',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    padding: '120px 0px 30px 50px',
  },
  title: {
    fontSize: '47px',
    fontWeight: '900',
    lineHeight: 1,
  },
  button: {
    fontSize: '16px',
    backgroundColor: '#FFFFFF',
    color: '#024BCE',
    width: '290px',
    height: '43px',
    borderRadius: '35px',
    marginTop: '40px',
    fontWeight: 'bold',
  },
}));

const PopupSurvey = ({ url, isShowing, img }) => {
  const classes = useStyles();
  const [openSurvey, setOpenSurvey] = React.useState(false);
  useEffect(() => {
    const hasSurveyBeenShownBefore = localStorage.getItem('hasSurveyBeenShown');
    if (!hasSurveyBeenShownBefore && isShowing) {
      setOpenSurvey(true);
      localStorage.setItem('hasSurveyBeenShown', true);
    }
  }, [isShowing]);
  const handleClose = () => {
    setOpenSurvey(false);
  };
  return (
    <Dialog
      open={openSurvey}
      maxWidth={'md'}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Paper
        elevation={0}
        className={classes.container}
        style={{ backgroundImage: `url(${img})` }}
      >
        <IconButton
          style={{ float: 'right', color: 'white' }}
          size="small"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography className={classes.text}>
          <span className={classes.title}>
            <FormattedMessage id="de.survey.title" />
          </span>
          <span
            style={{ fontSize: '30px', marginTop: '10px', fontWeight: '300' }}
          >
            {' '}
            <FormattedMessage id="de.survey.subtitle" />
          </span>
          <Link target="_blank" href={url}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleClose}
            >
              {' '}
              <FormattedMessage id="de.survey.button" />
            </Button>
          </Link>
        </Typography>
      </Paper>
    </Dialog>
  );
};

export default PopupSurvey;
