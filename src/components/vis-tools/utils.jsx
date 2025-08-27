import * as R from 'ramda';

const renameKey = R.curry((oldKey, newKey, obj) =>
  R.assoc(newKey, R.prop(oldKey, obj), R.dissoc(oldKey, obj)),
);

const propertiesKeys = [
  'width',
  'height',
  'freqStep',
  'maxX',
  'minX',
  'pivotX',
  'stepX',
  'maxY',
  'minY',
  'pivotY',
  'stepY',
  'title',
  'subtitle',
  'source',
];

export const renameProperties = (keys = propertiesKeys) =>
  R.map(
    R.ifElse(
      R.pipe(R.prop('id'), R.flip(R.includes)(keys)),
      renameKey('onChange', 'onSubmit'),
      R.identity,
    ),
  );
