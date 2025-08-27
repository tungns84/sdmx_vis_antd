import React from 'react';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

const styles = () => ({
  tooltip: {
    backgroundColor: '#616161',
  },
});

export default withStyles(styles)(({ children, classes, ...props }) => (
  <Tooltip
    classes={{ popper: classes.popper, tooltip: classes.tooltip }}
    {...props}
  >
    {children}
  </Tooltip>
));
