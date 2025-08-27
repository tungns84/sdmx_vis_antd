import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../components/messages';
import { changeDataquery, resetFilters } from '../ducks/sdmx';
import { formatMessage } from '../i18n';
import { getVisDimensionFormat } from '../selectors';
import { getFilterLabel } from '../utils';
import useGetUsedFilters from './useGetUsedFilters';

export default () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const selection = useGetUsedFilters();
  const labelAccessor = useSelector(getVisDimensionFormat());
  const onDelete = (filterId, values) =>
    dispatch(changeDataquery({ [filterId]: values }));
  const labelRenderer = getFilterLabel(labelAccessor);
  const onDeleteAll = () => dispatch(resetFilters(selection));
  const clearAllLabel = formatMessage(intl)(messages.clear);
  const labels = {
    reducingChip: formatMessage(intl)(messages.reducingChip),
  };
  return {
    items: selection,
    onDelete,
    labelRenderer,
    labels,
    clearAllLabel,
    onDeleteAll,
  };
};
