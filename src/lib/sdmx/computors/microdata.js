import * as R from 'ramda';
import { locales } from '../../settings';
import { rules } from '@sis-cc/dotstatsuite-components';
import { parseDataRange } from '@sis-cc/dotstatsuite-sdmxjs';

export const dataComputor =
  ({ locale, frequency, dataflow, hiddenIds }) =>
  (data) => {
    const options = {
      frequency,
      locale,
      dataflowId: dataflow.dataflowId,
      hiddenIds,
      timeFormat: R.path([locale, 'timeFormat'], locales),
    };

    const transformedData = rules.v8Transformer(data.data, options);

    return {
      data: transformedData.data,
      range: parseDataRange(data),
    };
  };
