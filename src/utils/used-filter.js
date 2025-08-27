import * as R from 'ramda';
import { parseDateFromSdmxPeriod } from '../lib/sdmx/frequency';

export const PERIOD = 'PERIOD';
export const LASTNOBSERVATIONS = 'LASTNOBSERVATIONS';
export const LASTNPERIODS = 'LASTNPERIODS';
export const START_PERIOD = 'START_PERIOD';
export const END_PERIOD = 'END_PERIOD';

export const getSelectedValuesWithPath = R.map((filter) => {
  const grouped = R.groupBy(R.prop('id'), filter.values);
  const { filtered, indexed } = R.reduce(
    (acc, val) => {
      const value =
        R.length(grouped[val.id]) > 1
          ? {
              ...val,
              parentId: undefined,
              parents: R.aperture(1, grouped[val.id]),
            }
          : val;
      if (R.has(val.id, acc.registered)) {
        return {
          ...acc,
          indexed: R.assoc(
            value.hierarchicalId || value.id,
            value,
            acc.indexed,
          ),
        };
      }
      return {
        filtered: value.isSelected
          ? R.append(value, acc.filtered)
          : acc.filtered,
        registered: R.assoc(value.id, value, acc.registered),
        indexed: R.assoc(value.hierarchicalId || value.id, value, acc.indexed),
      };
    },
    { filtered: [], indexed: {}, registered: {} },
    filter.values,
  );

  const getParents = (value) => {
    return value.parents
      ? [
          {
            ...value,
            parents: R.reduce(
              (acc, parent) => {
                const ancestorId = R.prop('parentId', R.head(parent));
                if (R.isNil(ancestorId) || !R.has(ancestorId, indexed)) {
                  return acc;
                }
                const res = R.append(
                  R.dissoc('parents', value),
                  getParents(R.prop(ancestorId, indexed)),
                );
                return R.append(res, acc);
              },
              [],
              value.parents,
            ),
          },
        ]
      : R.isNil(value.parentId) || !R.has(value.parentId, indexed)
        ? [value]
        : R.append(value, getParents(R.prop(value.parentId, indexed)));
  };

  const values = R.map(getParents, filtered);
  return R.assoc('values', values, filter);
});

export const getUsedFilterPeriod = (
  frequency,
  period,
  lastNObs,
  labelRenderer,
  timePeriod,
  lastNMode,
) => {
  const getLastNValues = (lastNObs) => {
    if (
      R.equals('0', lastNObs) ||
      R.isNil(lastNObs) ||
      R.isEmpty(lastNObs) ||
      R.isEmpty(lastNMode) ||
      R.isNil(lastNMode)
    )
      return [];
    return [
      [
        {
          id: LASTNOBSERVATIONS,
          label: lastNObs,
        },
      ],
    ];
  };

  const getPeriodsValues = (period, labelRenderer) => {
    const dates = parseDateFromSdmxPeriod(
      frequency,
      R.isNil(period) ? [] : period,
    );
    const ids = [START_PERIOD, END_PERIOD];
    return R.addIndex(R.reduce)((acc, period, index) => {
      if (R.isNil(period)) return acc;
      return R.append([
        {
          id: `${R.nth(index)(ids)}`,
          label: `${labelRenderer(period)}`,
        },
      ])(acc);
    }, [])(dates);
  };

  const values = [
    ...getPeriodsValues(period, labelRenderer),
    ...getLastNValues(lastNObs),
  ];
  return R.isEmpty(values)
    ? []
    : [{ id: PERIOD, label: R.prop('label')(timePeriod), values }];
};

export const getUsedFilterFrequency = R.curry(
  (frequencyType, frequencyOptions, freqDimension) =>
    R.pipe(
      (freq) => {
        const option = R.find(
          R.propEq(freq, 'id'),
          R.propOr([], 'values', freqDimension),
        );
        return option && R.propOr(true, 'display', option)
          ? R.prop(freq, frequencyOptions)
          : null;
      },
      R.ifElse(R.isNil, R.always([]), (label) => [
        {
          ...freqDimension,
          isNotRemovable: true,
          values: [
            [
              {
                id: 'frequency_type',
                label: label,
                isNotRemovable: true,
              },
            ],
          ],
        },
      ]),
    )(frequencyType),
);

export const addI18nLabels = (labels) => (item) => {
  if (R.isEmpty(item)) return [];
  return R.pipe(
    R.head,
    R.over(
      R.lensProp('values'),
      R.map(
        // second map is only one element
        R.map(
          R.ifElse(
            R.pipe(
              R.prop('id'),
              R.flip(R.includes)([
                'START_PERIOD',
                'END_PERIOD',
                'LASTNOBSERVATIONS',
              ]),
            ),
            (item) =>
              R.over(
                R.lensProp('label'),
                R.ifElse(
                  R.always(R.is(Array)(R.prop(item.id, labels))),
                  R.pipe(
                    R.flip(R.intersperse)(R.prop(item.id, labels)),
                    R.join(' '),
                  ),
                  R.concat(`${R.prop(item.id, labels)}: `),
                ),
              )(item),
            R.identity,
          ),
        ),
      ),
    ),
    R.of(Array),
  )(item);
};
