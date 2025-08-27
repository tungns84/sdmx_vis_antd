import * as R from 'ramda';
import {
  displayItems,
  formatCellValue,
  formatFlags,
  getPosition,
  getFlagsCodes,
} from './utils.js';

const addStyle = (workbook, position, style) => {
  workbook.sheet(0).cell(position).style(style);
};

export const getNumberFormat = ({
  intValue,
  value,
  flags = [],
  isRtl = false,
}) => {
  if (R.isNil(intValue)) {
    return null;
  }

  const valueFormat = R.pipe(R.split('.'), (splitted) => {
    const decimals =
      R.length(splitted) > 1 ? R.replace(/\d/g, '0', R.last(splitted)) : null;
    const format = '#,##0';
    return R.isNil(decimals) ? format : `${format}.${decimals}`;
  })(value);
  const flagsFormat = R.pipe(
    getFlagsCodes,
    R.map((code) => `\\${code}`),
    R.join(','),
  )(flags);
  return R.isEmpty(flagsFormat)
    ? valueFormat
    : isRtl
      ? `${valueFormat}   ${flagsFormat};${valueFormat}-   ${flagsFormat}`
      : `${flagsFormat}   ${valueFormat};${flagsFormat}   -${valueFormat}`;
};

export const registerCell = (
  workbook,
  position,
  cell = {},
  style = {},
  sheetIndex = 0,
  isFit = true,
  row,
  withVerticalHierarchy = false,
  labelAccessor,
  isRtl = false,
) => {
  const numberFormat = getNumberFormat({ ...cell, isRtl });
  const _style = R.isNil(numberFormat) ? style : { ...style, numberFormat };
  const styles = R.has('comment', _style)
    ? R.omit(['comment'], _style)
    : _style;
  addStyle(workbook, position, styles);
  withVerticalHierarchy && workbook.sheet(sheetIndex).row(row).height(43.2);
  workbook
    .sheet(sheetIndex)
    .cell(position)
    .value(formatCellValue({ ...cell, isRtl, labelAccessor }));
  workbook.sheet(sheetIndex).cell(position).contentShouldBeFitToCell = isFit;
  if (!R.isEmpty(R.propOr([], 'flags', cell))) {
    workbook
      .sheet(sheetIndex)
      .cell(position)
      .comment({
        text: formatFlags(labelAccessor)(cell.flags),
        width: '400pt',
        height: '50pt',
        horizontalAlignment: R.pathOr(
          'Left',
          ['comment', 'horizontalAlignment'],
          _style,
        ),
        textAlign: R.pathOr('left', ['comment', 'textAlign'], _style),
      });
  }
};

export const registerRange = (
  workbook,
  startPosition,
  endPosition,
  cell = {},
  style = {},
  sheetIndex = 0,
  isFit = true,
  row,
  withVerticalHierarchy = false,
  labelAccessor,
) => {
  const numberFormat = getNumberFormat(cell);
  const _style = R.isNil(numberFormat) ? style : { ...style, numberFormat };
  const styles = R.has('comment', _style)
    ? R.omit(['comment'], _style)
    : _style;
  withVerticalHierarchy && workbook.sheet(0).row(row).height(28.8);
  workbook
    .sheet(0)
    .range(`${startPosition}:${endPosition}`)
    .merged(true)
    .style({ ...styles });
  withVerticalHierarchy && workbook.sheet(sheetIndex).row(row).height(28.8);
  workbook
    .sheet(sheetIndex)
    .range(`${startPosition}:${endPosition}`)
    .merged(true)
    .value(formatCellValue({ ...cell, labelAccessor }));

  withVerticalHierarchy &&
    (workbook
      .sheet(sheetIndex)
      .row(row)
      .height(28.8)
      .cell(startPosition).contentShouldBeFitToCell = isFit);
};

export const registerSequenceInColumn = (
  workbook,
  row,
  col,
  values,
  _style = {},
  sheet = 0,
  isFit,
  withVerticalHierarchy = false,
  labelAccessor,
  isRtl = false,
) => {
  let index = 0;
  R.forEach((value) => {
    const cellCount = R.propOr(1, 'cellCount', value);
    const commentStyle = R.propOr({}, 'comment', _style);
    const style = R.pipe(R.dissoc('textAlign'), (st) =>
      R.isNil(value.intValue) && !R.isNil(_style.textAlign)
        ? R.assoc('horizontalAlignment', _style.textAlign, st)
        : st,
    )(_style);
    if (cellCount === 1) {
      registerCell(
        workbook,
        getPosition(row, col + index),
        value,
        style,
        sheet,
        isFit,
        row,
        withVerticalHierarchy,
        labelAccessor,
        isRtl,
      );
    } else {
      registerRange(
        workbook,
        getPosition(row, col + index),
        getPosition(row, col + index + cellCount - 1),
        value,
        style,
        sheet,
        isFit,
        row,
        withVerticalHierarchy,
        labelAccessor,
      );
      if (!R.isEmpty(R.propOr([], 'flags', value))) {
        let i = 0;
        const text = formatFlags(labelAccessor)(value.flags);
        while (i !== cellCount) {
          workbook
            .sheet(sheet)
            .cell(getPosition(row, col + index + i))
            .comment({
              text,
              width: '400pt',
              height: '50pt',
              horizontalAlignment: R.propOr(
                'Left',
                'horizontalAlignment',
                commentStyle,
              ),
              textAlign: R.propOr('left', 'textAlign', commentStyle),
            });
          i++;
        }
      }
    }
    index += cellCount;
  }, values);
};

export const registerSequenceInRow = (
  workbook,
  row,
  col,
  values,
  style = {},
  sheet = 0,
  isFit,
  labelAccessor,
  isRtl = false,
) => {
  R.addIndex(R.forEach)((value, index) => {
    registerCell(
      workbook,
      getPosition(row + index, col),
      value,
      style,
      sheet,
      isFit,
      row,
      false,
      labelAccessor,
      isRtl,
    );
  }, values);
};

export const registerOverview = (
  workbook,
  overviewProps = {},
  worksheetIndex = 1,
) => {
  const getName = (obj = {}) => R.prop('name')(obj);
  const getValuesObj = (arr = []) => R.head(R.prop('values')(R.head(arr)));
  const displayedList = (list = []) =>
    R.filter((item) => {
      const isDisplay = R.propOr(true, 'display', R.head(item.values || []));
      return R.propOr(true, 'display', item) && isDisplay === true;
    })(list);
  const charCode = 'B';
  let index = 1;
  const isValueVisible = true;
  const sheet = workbook.sheet(worksheetIndex);
  sheet.column('B').width(115).hidden(false).style({
    fontFamily: 'calibri',
    fontSize: 11,
    wrapText: true,
    verticalAlignment: 'top',
    horizontalAlignment: 'left',
  });
  sheet.cell(`B${index}`).value(overviewProps.title).style({ bold: true });
  !R.isNil(overviewProps.dataflowDescription) &&
    (index++,
    sheet.row(index).height(55.5),
    sheet.cell(`B${index}`).value(overviewProps.dataflowDescription));
  index += 2;
  !R.isEmpty(overviewProps.oneDimensions) &&
    (sheet.row(index).height(39.75),
    displayItems(
      sheet,
      charCode,
      index,
      isValueVisible,
      displayedList(overviewProps.oneDimensions),
    ),
    index++);
  !R.isEmpty(overviewProps.oneAttributes) &&
    (sheet.row(index).height(39.75),
    displayItems(
      sheet,
      charCode,
      index,
      isValueVisible,
      displayedList(overviewProps.oneAttributes),
    ),
    index++);
  index++;
  const displayedSelectedHierarchySchemes = R.join('\n')(
    R.addIndex(R.map)((hierarchies, idx) => {
      const { list } = overviewProps.makeHierarchyProps(idx, hierarchies);
      return R.map((value) => {
        const label = getName(value);
        const values = R.join(',')(
          R.map((itemVal) =>
            R.join(' > ')(R.map((val) => getName(val))(itemVal)),
          )(value.values),
        );
        return `${label}: ${values}`;
      })(list);
    }, displayedList(overviewProps.selectedHierarchySchemes)),
  );
  !R.isEmpty(overviewProps.selectedHierarchySchemes) &&
    (sheet.row(index).height(39.75),
    sheet.cell(`${charCode}${index}`).value(displayedSelectedHierarchySchemes),
    (index += 2));
  overviewProps?.homeFacetIds?.has('datasourceId') &&
    overviewProps.dataSpaceLabel &&
    (sheet
      .cell(`${charCode}${index}`)
      .value(
        `${getName(R.head(overviewProps.lists['dataSource']))}: ${getName(
          getValuesObj(overviewProps.lists['dataSource']),
        )} `,
      ),
    index++);
  !R.isNil(overviewProps.observationsCount) &&
    (sheet
      .cell(`${charCode}${index}`)
      .value(
        `${getName(
          R.head(overviewProps.lists['observationsCount']),
        )}: ${getName(
          getValuesObj(overviewProps.lists['observationsCount']),
        )} `,
      ),
    index++);
  overviewProps.validFrom &&
    (sheet
      .cell(`${charCode}${index}`)
      .value(
        `${getName(R.head(overviewProps.lists['validFrom']))}: ${getName(
          getValuesObj(overviewProps.lists['validFrom']),
        )} `,
      ),
    index++);
  index++;
  !R.isEmpty(overviewProps.externalResources) &&
    overviewProps?.lists?.relatedFiles &&
    (sheet
      .cell(`${charCode}${index}`)
      .value(`${getName(R.head(overviewProps?.lists?.relatedFiles))}`)
      .style({ bold: true }),
    index++,
    R.map((extResource) => {
      sheet
        .cell(`${charCode}${index}`)
        .value(`${R.prop('label', extResource)}`)
        .style({ fontColor: '4182D5', underline: true })
        .hyperlink(R.prop('link')(extResource));
      index++;
    })(overviewProps?.externalResources));
  index++;
  !R.isEmpty(R.pathOr([], ['complementaryData', 0], overviewProps)) &&
    overviewProps?.lists?.complementaryData &&
    (sheet
      .cell(`${charCode}${index}`)
      .value(`${getName(R.head(overviewProps?.lists?.complementaryData))}`)
      .style({ bold: true }),
    index++,
    R.map((relatedDataflow) => {
      sheet
        .cell(`${charCode}${index}`)
        .value(`${R.prop('label', relatedDataflow)}`)
        .style({ fontColor: '4182D5', underline: true })
        .hyperlink(
          R.concat(window.location.origin, R.prop('url')(relatedDataflow)),
        );
      index++;
    })(R.flatten(overviewProps?.complementaryData)));
};
