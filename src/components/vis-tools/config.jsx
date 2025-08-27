import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useIntl } from 'react-intl';
import labelsFactory from './labels';
import { ChartsConfig } from '@sis-cc/dotstatsuite-visions';
import { renameProperties } from './utils';
import { useSelector } from 'react-redux';
import { getViewer } from '../../selectors/router';
import mapping from './mapping';

const Config = ({ isAuthenticated, properties = {} }) => {
  const intl = useIntl();
  const labels = labelsFactory(intl);
  const viewerId = useSelector(getViewer);

  const _properties = useMemo(() => {
    return R.pipe(
      R.pick(R.propOr([], viewerId, mapping)),
      renameProperties(),
      R.when(
        R.always(!isAuthenticated),
        R.omit(['title', 'subtitle', 'source', 'logo', 'copyright']),
      ),
    )(properties);
  }, [properties, viewerId]);

  return <ChartsConfig properties={_properties} labels={labels} />;
};

Config.propTypes = {
  properties: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

export default Config;
