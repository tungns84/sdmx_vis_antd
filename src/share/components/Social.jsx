import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles(() => ({
  icon: {
    cursor: 'pointer',
    verticalAlign: 'bottom',
  },
}));

const Social = ({ links }) => {
  const classes = useStyles();
  return (
    <>
      {R.map(
        ({ Icon, id, link }) => (
          <IconButton
            key={id}
            component={Link}
            href={link}
            target="_blank"
            color="primary"
            rel="noopener noreferrer"
            size="small"
          >
            <Icon color="primary" fontSize="small" className={classes.icon} />
          </IconButton>
        ),
        links,
      )}
    </>
  );
};

Social.propTypes = {
  links: PropTypes.array,
};

export default Social;
