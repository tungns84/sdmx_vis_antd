import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import SortIcon from '@mui/icons-material/Sort';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { VerticalButton } from '@sis-cc/dotstatsuite-visions';
import { Menu } from '../visions/DeToolBar/helpers';
import { formatMessage } from '../../i18n';
import { changeSearchOrder } from '../../ducks/search';
import { getSortIndexSelected } from '../../selectors/router';
import { sortItems } from '../../lib/search/constants';

const messages = defineMessages({
  score: { id: 'de.search.result.relevance' },
  name: { id: 'de.search.result.alphabetical' },
  index: { id: 'de.search.result.lastupdated' },
  sort: { id: 'de.search.result.sort' },
});

const Sort = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const selectedIndex = useSelector(getSortIndexSelected);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);
  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const changeSortOrder = (index) => dispatch(changeSearchOrder(index));

  return (
    <>
      <VerticalButton
        onClick={openMenu}
        aria-label={formatMessage(intl)(messages.sort)}
        aria-expanded={isOpen}
        color="primary"
        startIcon={<SortIcon />}
      >
        {formatMessage(intl)(messages.sort)}
      </VerticalButton>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={closeMenu}>
        {R.addIndex(R.map)(
          ({ id, key }, index) => (
            <MenuItem
              key={id}
              onClick={() => changeSortOrder(index)}
              selected={R.equals(selectedIndex, index)}
            >
              <Typography variant="body2" color="textPrimary">
                {formatMessage(intl)(messages[key])}
              </Typography>
            </MenuItem>
          ),
          sortItems,
        )}
      </Menu>
    </>
  );
};

export default Sort;
