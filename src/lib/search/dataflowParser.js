import * as R from 'ramda';
import highlightParser from './highlightParser';
import C from './constants';

const markTag = /<(\/)?mark>/g;

const parseHighlights = R.pipe(
  R.toPairs,
  R.reduce((memo, [field, highlight]) => {
    const items = R.pipe(R.map(highlightParser), R.reject(R.isNil))(highlight);
    if (R.all(R.isEmpty)(items)) return memo;
    return [
      ...memo,
      [
        R.cond([
          [R.equals(C.DATASOURCE_ID), R.always('Id')],
          [R.T, R.identity],
        ])(field),
        items,
      ],
    ];
  }, []),
);

const enhanceDimensions = (dimensions = [], highlights) =>
  R.pipe(
    R.map(R.replace(markTag, '')),
    R.difference(dimensions),
    R.concat(highlights),
  )(highlights);

const getHightlightedField = (key) => R.pipe(R.propOr([], key), R.head);
export const getHightlight = ({ field, fieldKey, highlights = {} }) => {
  if (R.isNil(fieldKey)) return field;

  // if <mark> is used in field, false positive
  // if field is in html, highlighted field may break original html
  const hightlightedField = getHightlightedField(fieldKey)(highlights);

  if (R.isNil(hightlightedField)) return field;

  return R.pipe(R.replace(markTag, ''), (x) =>
    R.replace(x, hightlightedField, field),
  )(hightlightedField);
};

export default (options) => (data) => {
  const { id, name, description, dimensions, ...dataflow } = data;
  const highlights = R.propOr({}, id, options.highlighting);

  const highlightedName = R.defaultTo(
    R.defaultTo(id, name),
    getHightlight({ field: name, fieldKey: 'name', highlights }),
  );

  return {
    ...dataflow,
    id,
    name: highlightedName,
    description: getHightlight({
      field: description,
      fieldKey: 'description',
      highlights,
    }),
    dimensions: enhanceDimensions(
      dimensions,
      R.propOr([], 'dimensions')(highlights),
    ),
    highlights: parseHighlights(
      R.omit(['name', 'description', 'dimensions'], highlights),
    ),
  };
};
