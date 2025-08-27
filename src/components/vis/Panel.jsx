import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { changeActionId } from '../../ducks/vis';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(1, 0, 1, 0),
    padding: theme.spacing(2),
  },
}));
const Panel = ({ children, actionId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <Paper elevation={2} className={classes.container}>
      <IconButton
        style={{ float: 'right' }}
        size="small"
        color="primary"
        onClick={() => dispatch(changeActionId(actionId))}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      {children}
    </Paper>
  );
};
Panel.propTypes = {
  children: PropTypes.node,
  actionId: PropTypes.string,
};
export default Panel;
