import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Tooltip } from '@sis-cc/dotstatsuite-visions';
import HelpIcon from '@mui/icons-material/EmojiObjects';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LensIcon from '@mui/icons-material/Lens';
import { FormattedMessage, formatMessage } from '../i18n';
import messages from './messages';
import useTooltip from '../hooks/useTooltip';

const FILTERS_ID = 'filters';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    fontFamily: 'Roboto Slab, serif',
    fontSize: '17px',
    color: 'Body',
  },
}));

const FiltersHelp = ({ isSearch }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { open, onOpen, onClose } = useTooltip();

  return (
    <Grid container data-testid="filters-help">
      <Typography
        variant="body2"
        className={classes.root}
        id={FILTERS_ID}
        tabIndex={0}
      >
        {isSearch ? (
          <FormattedMessage id="de.side.filters.result" />
        ) : (
          <FormattedMessage id="de.side.filters.action" />
        )}
        &nbsp;
      </Typography>
      {isSearch && (
        <Tooltip
          variant="light"
          tabIndex={0}
          aria-label={formatMessage(intl)(messages.help)}
          aria-hidden={false}
          placement="bottom-start"
          title={
            <Typography id="filtersHelpers" variant="body2">
              <FormattedMessage
                id="de.filters.search.help"
                values={{ icon: <LensIcon style={{ fontSize: 5 }} /> }}
              />
            </Typography>
          }
          open={open}
          onOpen={onOpen}
          onClose={onClose}
        >
          <HelpIcon fontSize="small" />
        </Tooltip>
      )}
    </Grid>
  );
};

FiltersHelp.propTypes = {
  isSearch: PropTypes.bool,
};

export default FiltersHelp;
