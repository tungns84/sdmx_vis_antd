import * as R from 'ramda';

const invariant = [
  'width',
  'height',
  'title',
  'subtitle',
  'source',
  'logo',
  'copyright',
];
const focus = ['highlight', 'baseline'];
const scatter = ['scatterDimension', 'scatterX', 'scatterY'];
const symbol = ['symbolDimension'];
const stack = ['stackedDimension', 'stackedMode'];
export const axisFactory = (key) => [`min${key}`, `max${key}`, `step${key}`];

const mapping = {
  BarChart: [
    ...invariant,
    ...focus,
    ...R.insert(2, 'pivotY', axisFactory('Y')),
  ],
  RowChart: [
    ...invariant,
    ...focus,
    ...R.insert(2, 'pivotX', axisFactory('X')),
  ],
  TimelineChart: [...invariant, ...focus, ...axisFactory('Y'), 'freqStep'],
  ScatterChart: [
    ...invariant,
    ...focus,
    ...axisFactory('Y'),
    ...axisFactory('X'),
    ...scatter,
  ],
  HorizontalSymbolChart: [
    ...invariant,
    ...focus,
    ...axisFactory('X'),
    ...symbol,
  ],
  VerticalSymbolChart: [...invariant, ...focus, ...axisFactory('Y'), ...symbol],
  StackedBarChart: [...invariant, ...focus, ...axisFactory('Y'), ...stack],
  StackedRowChart: [...invariant, ...focus, ...axisFactory('X'), ...stack],
  ChoroplethChart: [...invariant],
};

export default mapping;
