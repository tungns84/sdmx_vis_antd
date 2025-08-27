import React from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from '../i18n';
import { getIsMicrodata } from '../selectors/microdata';
import { countNumberOf } from '../utils';
import { getRefinedDataRange } from '../selectors/sdmx';
import useFilterFrequency from '../hooks/useFilterFrequency';
import useGetUsedFilters from '../hooks/useGetUsedFilters';

const VisDataPoints = () => {
  const theme = useTheme();
  const isMicrodata = useSelector(getIsMicrodata);
  const range = useSelector(getRefinedDataRange);
  const { frequencyFilter = [], periodFilter = [] } = useFilterFrequency();
  const selection = useGetUsedFilters();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));
  const style = {
    marginTop: isNarrow ? 0 : theme.spacing(-3),
  };
  const counter = countNumberOf(
    R.concat(selection, R.concat(frequencyFilter, periodFilter)),
  );
  const obsCount = R.propOr(0, 'total', range);

  if (isMicrodata || counter !== 0 || obsCount === 0) return null;

  return (
    <div style={style}>
      <Typography
        variant="body2"
        tabIndex={0}
        style={{
          fontFamily: 'Roboto Slab, serif',
          fontSize: '17px',
        }}
      >
        <FormattedMessage id="de.vis.all.data.points" values={{ obsCount }} />
      </Typography>
    </div>
  );
};

export default VisDataPoints;
