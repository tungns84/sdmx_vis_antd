import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import MuiInfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { toggleMetadata } from '../../ducks/metadata';
import { getCoordinates, getMSDIdentifiers } from '../../selectors/metadata';
import { isMetadataSupported } from '../../lib/sdmx/metadata';
import { getRawStructureRequestArgs } from '../../selectors/sdmx';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.primary.main,
    backgroundColor: 'inherit',
    padding: 0,
  },
  selected: {
    color: theme.palette.highlight.hl1,
    backgroundColor: 'black',
    padding: 0,
  },
}));

const Icon = ({ sideProps }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedCoordinates = useSelector(getCoordinates);
  const onClick = () => {
    dispatch(toggleMetadata(sideProps));
  };
  const isSelected = R.equals(
    R.prop('coordinates', sideProps || {}),
    selectedCoordinates,
  );
  return (
    <IconButton
      size="small"
      className={isSelected ? classes.selected : classes.icon}
      onClick={onClick}
      data-testid="ref-md-info"
      aria-pressed={isSelected}
      aria-label={`metadata-${R.join('-', R.values(sideProps.coordinates))}`}
    >
      <MuiInfoIcon fontSize="small" />
    </IconButton>
  );
};

Icon.propTypes = {
  sideProps: PropTypes.object,
};

const MetadataIcon = ({ sideProps }) => {
  const msdRef = useSelector(getMSDIdentifiers);
  const { datasource } = useSelector(getRawStructureRequestArgs);
  const isMetadataEnabled = !R.isNil(msdRef) && isMetadataSupported(datasource);
  if (
    R.isNil(sideProps) ||
    (!sideProps?.hasAdvancedAttributes &&
      !isMetadataEnabled &&
      !sideProps?.advancedAttributes)
  ) {
    return null;
  }
  return <Icon sideProps={sideProps} />;
};

MetadataIcon.propTypes = {
  sideProps: PropTypes.object,
};

export default MetadataIcon;
