import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Typography from '@mui/material/Typography';
import cx from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import { Tooltip } from '@sis-cc/dotstatsuite-visions';
import { isLast } from './utils';

const useStyles = makeStyles((theme) => ({
  tooltipIndicator: {
    borderBottom: `1px dotted ${theme.palette.primary.main}`,
  },
  label: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
}));

const BulletIcon = () => (
  <svg width="16" height="8">
    <circle cx="8" cy="4" r="3" stroke={'#000000'} fill={'#000000'} />
  </svg>
);
const HierarchyLabels = ({ values = [], isLastItem = true, accessor }) => {
  return R.addIndex(R.map)(
    (value, index) => (
      <React.Fragment key={`${value.id}-${index}`}>
        {`${accessor(value)}${
          !isLast(index, values) ? ' > ' : isLastItem ? '' : ', '
        }`}
      </React.Fragment>
    ),
    values,
  );
};

HierarchyLabels.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    }),
  ),
};

const GroupLabels = ({
  list = [],
  accessor = R.prop('name'),
  isValueVisible = true,
  isHierarchy = false,
  hasGroupSeparator = false,
}) => {
  const classes = useStyles();
  const displayedList = R.filter((item) => {
    const isDisplay = R.propOr(true, 'display', R.head(item.values || []));
    return R.propOr(true, 'display', item) && isDisplay === true;
  })(list);
  return (
    <Typography component="span" variant="body2">
      {R.addIndex(R.map)(
        (item, index) => (
          <React.Fragment key={item.id}>
            <Tooltip placement="top" title={item?.description || ''}>
              <span>
                <span
                  className={cx(classes.label, {
                    [classes.tooltipIndicator]: item?.description,
                  })}
                >
                  {R.is(Function, accessor) ? `${accessor(item)}` : item.name}
                </span>
                {isValueVisible && ': '}
              </span>
            </Tooltip>
            {isValueVisible &&
              R.is(Array, item.values) &&
              (isHierarchy
                ? R.addIndex(R.map)((value, index) => (
                    <HierarchyLabels
                      key={`hierarchyValue-${index}`}
                      values={value}
                      isLastItem={isLast(index, item.values)}
                      accessor={accessor}
                    />
                  ))(item.values)
                : accessor(R.head(item.values)))}
            {!isLast(index, displayedList) && <BulletIcon />}
            {hasGroupSeparator && <br />}
          </React.Fragment>
        ),
        displayedList,
      )}
    </Typography>
  );
};

GroupLabels.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      description: PropTypes.string,
      values: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      ),
    }),
  ),
  accessor: PropTypes.func,
  isValueVisible: PropTypes.bool,
  isHierarchy: PropTypes.bool,
  hasGroupSeparator: PropTypes.bool,
  classes: PropTypes.object,
};

export default GroupLabels;
