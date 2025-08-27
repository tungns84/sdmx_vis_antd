import React from 'react';
import * as R from 'ramda';
import makeStyles from '@mui/styles/makeStyles';
import Dataflow from './dataflow';

const useStyles = makeStyles((theme) => ({
  root: {
    borderTop: `1px solid ${theme.palette.grey[700]}`,
  },
}));

const Dataflows = ({ dataflows }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="search_results">
      {R.map(
        (dataflow) => (
          <Dataflow key={dataflow.id} dataflow={dataflow} />
        ),
        dataflows,
      )}
    </div>
  );
};

export default Dataflows;
