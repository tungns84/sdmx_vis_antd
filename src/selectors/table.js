import { createSelector } from 'reselect';
import { getTableLayout as getRouterLayoutIds } from './router';
import { getDefaultLayoutIds } from './sdmx';
import {
  getHierarchisedDimensions,
  getRefinedAttributes,
  getSeriesCombinations,
} from './data';
import { rules2 } from '@sis-cc/dotstatsuite-components';

export const getLayoutIds = createSelector(
  getDefaultLayoutIds,
  getRouterLayoutIds,
  getHierarchisedDimensions,
  getRefinedAttributes,
  getSeriesCombinations,
  rules2.getTableLayoutIds,
);
