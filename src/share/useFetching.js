import { useEffect } from 'react';
import * as R from 'ramda';

export const useFetching = (actionCreator, dependencies = [], dispatch) => {
  useEffect(() => {
    if (!R.all(R.isNil)(dependencies)) dispatch(actionCreator()(dispatch));
  }, dependencies);
};
