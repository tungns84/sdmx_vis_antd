import { getUsedFilters } from '../lib/sdmx/filters';
import { useSelector } from 'react-redux';
import { getDimensionsWithDataQuerySelection } from '../selectors/sdmx';
import useSdmxStructure from './useSdmxStructure';

export default () => {
  const { automatedSelections } = useSdmxStructure();

  const dimensions = useSelector((state) =>
    getDimensionsWithDataQuerySelection(state, { automatedSelections }),
  );

  /*
    Previous getSelection selector was unneccessary depending on getFilters.
    Filters are listening to data requests in order to update data availability
    but used filters don't,
    just need to inherit dimensions and hierarchies definitions
    provided by the structure and listening to dataquery updates.

    Multi hierarchy still needs to be handled for display,
    and props definition in component should be reviewed and enhanced.
  */
  return getUsedFilters(dimensions);

  /* const usedFilters = useMemo(() => {

    return getUsedFilters(dimensions);
  }, [dimensions]);

  return usedFilters; */
};
