import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLayoutIds } from '../selectors/table';
import { getCustomAttributes, getIsTimeInverted } from '../selectors';
import { getDataRequestRange } from '../selectors/sdmx';
import {
  getAttributesSeries,
  getDuplicatedObservations,
  getHeaderCoordinates,
  getHierarchisedDimensions,
  getMetadataCoordinates,
  getOneValueDimensions,
  getRefinedAttributes,
  getSeriesCombinations,
} from '../selectors/data';
import { rules } from '../lib/dotstatsuite-antd/rules';

export default () => {
  const layoutIds = useSelector(getLayoutIds);
  const customAttributes = useSelector(getCustomAttributes);
  const limit = useSelector(getDataRequestRange);
  const isTimeInverted = useSelector(getIsTimeInverted);

  const headerCoordinates = useSelector(getHeaderCoordinates);
  const combinations = useSelector(getSeriesCombinations);
  const observations = useSelector(getDuplicatedObservations);
  const dimensions = useSelector(getHierarchisedDimensions);
  const attributes = useSelector(getRefinedAttributes);
  const oneValueDimensions = useSelector(getOneValueDimensions);
  const attributesSeries = useSelector(getAttributesSeries);
  const metadataCoordinates = useSelector(getMetadataCoordinates);

  const data = {
    observations,
    dimensions,
    combinations,
    oneValueDimensions,
    attributesSeries,
    metadataCoordinates,
    attributes,
    header: { coordinates: headerCoordinates },
  };
  const tableProps = useMemo(() => {
    return rules.getTableProps({
      data,
      layoutIds,
      customAttributes,
      limit,
      isTimeInverted,
    });
  }, [data, layoutIds, customAttributes, limit, isTimeInverted]);

  return tableProps;
};
