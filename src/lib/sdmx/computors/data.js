import * as R from 'ramda';
import { customAttributes, locales } from '../../settings';
import { rules, rules2 } from '@sis-cc/dotstatsuite-components';
import { parseDataRange } from '@sis-cc/dotstatsuite-sdmxjs';

export const dataComputor =
  ({ locale, frequency, dataflow, dataquery }) =>
  (data) => {
    const options = {
      frequency,
      locale,
      dataflowId: dataflow.dataflowId,
      timeFormat: R.path([locale, 'timeFormat'], locales),
    };

    const transformedData = R.pipe(
      rules.v8Transformer,
      R.prop('data'),
      R.over(
        R.lensPath(['structure', 'dimensions', 'observation']),
        (dimensions) => rules2.refineDimensions(dimensions, dataquery),
      ),
    )(data.data, options);

    const dimensions = R.pathOr(
      [],
      ['structure', 'dimensions', 'observation'],
      transformedData,
    );
    const attributes = R.pathOr(
      [],
      ['structure', 'attributes', 'observation'],
      transformedData,
    );

    const parsedAttributes = rules2.parseAttributes(
      attributes,
      dimensions,
      customAttributes,
    );

    return {
      data: transformedData,
      range: parseDataRange(data),
      parsedAttributes,
    };
  };
