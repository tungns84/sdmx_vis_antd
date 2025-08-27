import * as R from 'ramda';

export const getValue = (labelAccessor) => (item) =>
  R.has('values', item)
    ? R.converge(
        (value, label) => R.assoc('label', label, value),
        [
          R.reduce(
            (acc, val) => ({
              id: R.isEmpty(acc.id) ? val.id : `${acc.id}, ${val.id}`,
              flags: R.concat(acc.flags, val.flags || []),
              parents: R.concat(acc.parents, val.parents || []),
            }),
            { id: '', flags: [], parents: [] },
          ),
          labelAccessor,
        ],
      )(R.prop('values', item))
    : R.pipe(R.prop('value'), (val) =>
        R.assoc('label', R.isNil(val) ? '' : labelAccessor(val), val),
      )(item);

export const getPosition = (row, column) => {
  let id = '';
  for (let a = 1, b = 26; (column -= a) >= 0; a = b, b *= 26) {
    id = String.fromCharCode(parseInt((column % b) / a) + 65) + id;
  }
  return `${id}${row}`;
};

export const getFlagsCodes = (flags = []) =>
  R.pipe(
    R.partition((flag) => !R.isNil(flag.code)),
    ([coded, uncoded]) => {
      const codes = R.pluck('code', coded);
      return R.isEmpty(uncoded) ? codes : R.append('*', codes);
    },
  )(flags);

export const formatCellValue = ({
  intValue,
  header,
  label = '',
  value,
  flags,
  isRtl = false,
  labelAccessor,
}) => {
  if (!R.isNil(intValue)) {
    return intValue;
  }
  const flagsCodes = getFlagsCodes(flags);
  const formattedCodes = R.join(',', flagsCodes);
  if (!R.isNil(value)) {
    if (R.is(Object, value)) {
      return labelAccessor(value);
    }
    if (!R.isEmpty(formattedCodes)) {
      return isRtl
        ? `${value} ${formattedCodes}`
        : `${formattedCodes} ${value}`;
    }
    return value;
  }
  const res = R.isNil(header) ? label : `${header} ${label}`;
  return R.isEmpty(formattedCodes) ? res : `${res} ${formattedCodes}`;
};

export const formatFlags = (labelAccessor) =>
  R.pipe(
    R.map((entry) => {
      if (R.has('label', entry)) {
        return R.isNil(entry.header)
          ? entry.label
          : `${entry.header} ${entry.label}`;
      }
      const value = getValue(labelAccessor)(entry);
      const header = labelAccessor(entry);
      const formattedSelf = R.isNil(header)
        ? value.label
        : `${header}: ${value.label}`;
      const formattedSub = R.ifElse(
        R.isNil,
        R.always([]),
        R.pipe(formatFlags(labelAccessor), R.of(Array)),
      )(entry.sub);
      return R.prepend(formattedSelf, formattedSub);
    }),
    R.unnest,
    R.join('\n'),
  );

export const formatSection = (labelAccessor) =>
  R.map((entry) => {
    const value = getValue(labelAccessor)(entry);
    return {
      label: `${labelAccessor(entry.dimension || {})}: ${R.propOr(
        '',
        'label',
        value,
      )}`,
      flags: R.propOr([], 'flags', value),
    };
  });

export const displayItems = (
  sheet,
  charCode,
  index,
  isValueVisible = false,
  list,
) => {
  const displayedData = R.join(' • ')(
    R.map((item) =>
      isValueVisible
        ? `${R.prop('label')(item)}: ${R.prop('label')(R.head(item.values))}`
        : R.prop('label')(item),
    )(list),
  );
  sheet.cell(`${charCode}${index}`).value(displayedData);
};
