import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import { CopyContent as CopyContentIcon } from '@sis-cc/dotstatsuite-visions';

const useStyles = makeStyles((theme) => ({
  select: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  icon: {
    cursor: 'pointer',
    verticalAlign: 'bottom',
  },
}));

const ViewerCell = ({ viewerUrl }) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(viewerUrl);
    (setCopied(true), setTimeout(() => setCopied(false), 200));
  };

  return (
    <>
      <Link
        color="primary"
        href={viewerUrl}
        className={cx({ [classes.select]: copied })}
      >
        {viewerUrl}
      </Link>
      &nbsp;
      <IconButton
        component={Link}
        href={viewerUrl}
        target="_blank"
        color="primary"
        rel="noopener noreferrer"
        size="small"
      >
        <OpenInNewIcon
          color="primary"
          fontSize="small"
          className={classes.icon}
        />
      </IconButton>
      &nbsp;
      <IconButton size="small" onClick={copyToClipboard}>
        <CopyContentIcon
          color="primary"
          className={classes.icon}
          fontSize="small"
        />
      </IconButton>
    </>
  );
};

ViewerCell.propTypes = {
  viewerUrl: PropTypes.string,
};

export default ViewerCell;
