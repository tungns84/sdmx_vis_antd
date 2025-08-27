import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    padding: theme.spacing(1, 2),
  },
  title: {
    borderBottom: `solid 2px ${theme.palette.grey[700]}`,
  },
}));

const AlertDialog = ({
  Icon,
  customButton,
  title,
  description,
  handleOpen,
  handleClose,
  open,
  children,
}) => {
  const classes = useStyles();
  const button = customButton || (
    <IconButton
      color="primary"
      aria-label="delete"
      size="small"
      onClick={handleOpen}
    >
      <Icon />
    </IconButton>
  );
  return (
    <>
      {button}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.titleContainer}>
          <Typography className={classes.title} component="h2" variant="h6">
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>{children}</DialogActions>
      </Dialog>
    </>
  );
};

AlertDialog.propTypes = {
  Icon: PropTypes.object,
  labels: PropTypes.object,
  open: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  customButton: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
};

export default AlertDialog;
