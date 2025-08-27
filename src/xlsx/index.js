// Lazy load XlsxPopulate to handle CommonJS module
let XlsxPopulateModule;
const getXlsxPopulate = async () => {
  if (!XlsxPopulateModule) {
    const module = await import('@eyeseetea/xlsx-populate');
    XlsxPopulateModule = module.default || module;
  }
  return XlsxPopulateModule;
};
import * as R from 'ramda';
import { SHEET1, SHEET2 } from './constants';
import {
  registerCell,
  registerSequenceInRow,
  registerSequenceInColumn,
  registerOverview,
} from './register';
import { getPosition, formatSection, getValue } from './utils.js';
import {
  getSectionStyles,
  getHeaderStyles,
  getRowStyles,
  getRtlStyles,
} from './styles';

export const createExcelWorkbook = async ({
  footerProps,
  headerProps,
  tableProps,
  theme,
  overviewProps,
}) => {
  const { direction } = theme;

  const isRtl = R.equals('rtl', direction);
  const XlsxPopulate = await getXlsxPopulate();
  return XlsxPopulate.fromBlankAsync().then((workbook) => {
    //workbook already has a sheet that just needs to be renamed
    workbook.sheet(0).name(SHEET1);
    workbook.addSheet(SHEET2, 1);
    workbook.sheet(0).rightToLeft(isRtl);
    workbook.sheet(1).rightToLeft(isRtl);

    const { cells, headerData, sectionsData, labelAccessor, textAlign } =
      tableProps;

    const rtlStyles = getRtlStyles(isRtl);
    const headerStyles = getHeaderStyles(theme, {
      ...R.omit(['comment'], rtlStyles),
    });
    const sectionStyles = getSectionStyles(theme, {
      ...R.omit(['comment'], rtlStyles),
    });
    const rowStyles = getRowStyles(theme, {
      ...R.omit(['comment'], rtlStyles),
    });
    const disclaimerStyles = R.omit(['comment'], rtlStyles);
    const tableLengthInRow = R.length(headerData);
    const rowDimensions = R.pipe(
      R.pathOr([], [0, 1, -1, 'data']),
      R.pluck('dimension'),
      R.map((d) => getValue(labelAccessor)({ value: d })),
    )(sectionsData);

    const rowDimensionsLength = R.length(rowDimensions);
    const tableFullLength = tableLengthInRow + rowDimensionsLength;
    const startTablePosition = 2; // 1 = A, 2 = B
    const spaceLength = 1;
    let rowIndex = 1;
    registerCell(
      workbook,
      getPosition(rowIndex, startTablePosition),
      R.propOr({}, 'title', headerProps),
      {
        bold: true,
        ...rtlStyles,
      },
      0,
      false,
      rowIndex,
      false,
      labelAccessor,
      isRtl,
    );
    rowIndex++;

    const subtitle = R.propOr([], 'subtitle', headerProps);
    registerSequenceInRow(
      workbook,
      rowIndex,
      startTablePosition,
      subtitle,
      rtlStyles,
      0,
      false,
      labelAccessor,
    );
    rowIndex = R.length(subtitle) + rowIndex;

    const combinations = R.propOr([], 'combinations', headerProps);
    if (!R.isEmpty(combinations)) {
      registerSequenceInRow(
        workbook,
        rowIndex,
        startTablePosition,
        combinations,
        rtlStyles,
        0,
        false,
        labelAccessor,
        isRtl,
      );
      rowIndex = R.length(combinations) + rowIndex;
    }
    if (!R.isNil(R.prop('disclaimer', headerProps))) {
      workbook
        .sheet(0)
        .cell(getPosition(rowIndex, startTablePosition))
        .value(R.prop('disclaimer', headerProps))
        .style({ ...disclaimerStyles, fontColor: 'ff0000' });
      rowIndex++;
    }
    rowIndex++;
    const beginRowIndex = rowIndex;
    /*
      header
      | dim1 | col1 val | ... | coln val |
                    ...
      | dimn | col1 val | ... | coln val |
    */
    const addHierarchySpaceHeader = (cell) =>
      R.pipe(
        R.propOr([], 'parents'),
        R.when(R.isNil, R.always([])),
        R.length,
        R.times(() => '· \n'),
        R.join(''),
        R.flip(R.concat)(cell.label),
      )(cell);

    const nHeaderRows = R.pipe(
      R.pathOr([], [-1, 'data']),
      R.length,
    )(headerData);
    const transposedHeaderData = R.pipe(
      R.pluck('data'),
      R.map((cells) =>
        R.reduce(
          (acc, index) => {
            const cell = R.nth(index, cells) || {};
            const previousCell = R.last(acc);
            const previousCellKey = R.prop('key', previousCell);
            const valueId = R.has('values', cell)
              ? R.pipe(R.pluck('id'), R.join('-'))(cell.values)
              : R.pathOr(`missing${index}`, ['value', 'id'], cell);
            const cellKey = R.isNil(previousCellKey)
              ? valueId
              : `${previousCellKey}-${valueId}`;
            return R.append(R.assoc('key', cellKey, cell), acc);
          },
          [],
          R.times(R.identity, nHeaderRows),
        ),
      ),
      R.transpose,
    )(headerData);
    R.addIndex(R.forEach)((headerRow, headerRowIndex) => {
      const dim = R.pathOr({}, [-1, 'dimension'], headerRow);
      workbook
        .sheet(0)
        .range(
          `${getPosition(rowIndex, startTablePosition)}:${getPosition(
            rowIndex,
            startTablePosition + rowDimensionsLength,
          )}`,
        )
        .merged(true)
        .style(headerStyles.title)
        .value(labelAccessor(dim));

      const mergedHeaderCells = R.when(
        R.always(headerRowIndex !== nHeaderRows - 1),
        R.reduce((acc, headerCell) => {
          const previousCell = R.last(acc);
          const cellValue = R.prop('key', headerCell);
          const previousCellValue = R.prop('key', previousCell);
          if (cellValue !== previousCellValue) {
            return R.append(R.assoc('cellCount', 1, headerCell), acc);
          }
          return R.over(
            R.lensIndex(-1),
            R.evolve({ cellCount: R.add(1) }),
            acc,
          );
        }, []),
      )(headerRow);
      const hierarchySpaceLayout = R.pipe(
        R.map((cell) => {
          const value = getValue(labelAccessor)(cell);
          const label = addHierarchySpaceHeader(value);
          return {
            flags: R.pathOr([], ['value', 'flags'], cell),
            ...R.pick(['key', 'cellCount'], cell),
            label,
          };
        }),
      )(mergedHeaderCells);
      registerSequenceInColumn(
        workbook,
        rowIndex,
        startTablePosition + rowDimensionsLength + spaceLength,
        hierarchySpaceLayout,
        { ...headerStyles.value, comment: rtlStyles.comment },
        0,
        true,
        true,
        labelAccessor,
      );
      rowIndex++;
    }, transposedHeaderData);

    // row header | dim1 | ... | dimn| | col1Flags| ... | colnFlags |
    registerSequenceInColumn(
      workbook,
      rowIndex,
      startTablePosition,
      rowDimensions,
      { ...rowStyles.rowTitle, comment: rtlStyles.comment },
      0,
      true,
      false,
      labelAccessor,
      isRtl,
    );
    // space
    registerCell(
      workbook,
      getPosition(rowIndex, startTablePosition + rowDimensionsLength),
      { comment: rtlStyles.comment },
      rowStyles.space,
    );
    registerSequenceInColumn(
      workbook,
      rowIndex,
      startTablePosition + rowDimensionsLength + spaceLength,
      headerData,
      { ...rowStyles.space, comment: rtlStyles.comment },
      0,
      false,
      false,
      labelAccessor,
    );
    rowIndex++;

    /*
      sections
      | section dim 1 val                                                         | section flags|
      |       ...                                                                 |              |
      | section dim X val                                                         |              |
      | row 1 dim 1 val | ... | row 1 dim Y val | row 1 flags | row 1 cell 1| ... | row 1 cell Z |
                                                ...
      | row N dim 1 val | ... | row N dim Y val| row N flags | row N cell 1 | ... | row N cell Z |
    */
    const addHierarchySpace = (cell) =>
      R.pipe(
        R.propOr([], 'parents'),
        R.when(R.isNil, R.always([])),
        R.length,

        R.times(() => '·  '),
        R.join(''),
        R.flip(R.concat)(cell.label),
      )(cell);

    let sectionRowIndexes = [];
    R.forEach(([section, rows]) => {
      if (!R.isEmpty(R.propOr([], 'data', section))) {
        const sectionData = formatSection(labelAccessor)(section.data);
        registerSequenceInRow(
          workbook,
          rowIndex,
          startTablePosition,
          sectionData,
          {
            ...sectionStyles,
            border: { left: true },
          },
          0,
          false,
          labelAccessor,
          isRtl,
        );

        const beginSectionIndex = rowIndex;

        R.forEach(() => {
          sectionRowIndexes = R.append(rowIndex)(sectionRowIndexes);
          workbook
            .sheet(0)
            .range(
              `${getPosition(rowIndex, startTablePosition)}:${getPosition(
                rowIndex,
                startTablePosition + tableFullLength - 1,
              )}`,
            )
            .merged(true)
            .style(sectionStyles);
          workbook
            .sheet(0)
            .range(
              `${getPosition(
                beginSectionIndex,
                startTablePosition + tableFullLength,
              )}:${getPosition(
                beginSectionIndex + R.length(sectionData) - 1,
                startTablePosition + tableFullLength,
              )}`,
            )
            .merged(true)
            .style({
              ...sectionStyles,
              border: { right: true },
            });
          rowIndex++;
        })(sectionData);

        registerCell(
          workbook,
          getPosition(beginSectionIndex, startTablePosition + tableFullLength),
          section,
          {
            horizontalAlignment: isRtl ? 'left' : 'right',
            verticalAlignment: 'top',
            comment: { ...R.prop('comment', rtlStyles) },
          },
          0,
          false,
          rowIndex,
          false,
          labelAccessor,
          isRtl,
        );
      }

      R.forEach((row) => {
        registerSequenceInColumn(
          workbook,
          rowIndex,
          startTablePosition,
          R.pipe(
            R.map(getValue(labelAccessor)),
            R.map((cell) =>
              R.set(R.lensProp('label'), addHierarchySpace(cell))(cell),
            ),
          )(row.data),
          { ...rowStyles.title, comment: rtlStyles.comment },
          0,
          true,
          true,
          labelAccessor,
          // isRtl
        );

        registerCell(
          workbook,
          getPosition(rowIndex, startTablePosition + rowDimensionsLength),
          row,
          {
            ...rowStyles.space,
            comment: rtlStyles.comment,
            horizontalAlignment: isRtl ? 'left' : 'right',
          },
          0,
          false,
          rowIndex,
          false,
          labelAccessor,
          isRtl,
        );

        registerSequenceInColumn(
          workbook,
          rowIndex,
          startTablePosition + rowDimensionsLength + spaceLength,
          R.map(
            (col) => R.pathOr({}, [col.key, section.key, row.key, 0], cells),
            headerData,
          ),
          {
            ...rowStyles.value,
            textAlign,
            horizontalAlignment: isRtl ? 'left' : 'right',
            comment: rtlStyles.comment,
          },
          0,
          true,
          false,
          labelAccessor,
          isRtl,
        );
        rowIndex++;
      }, rows);
    }, sectionsData);

    const endRowIndex = rowIndex - 1;
    workbook
      .sheet(0)
      .cell(getPosition(rowIndex + 1, startTablePosition))
      .value(
        `${R.path(
          ['copyright', 'label', 'props', 'children'],
          footerProps,
        )} ${R.path(['copyright', 'content'], footerProps)} `,
      )
      .style({
        fontColor: '0563c1',
        underline: true,
        textDirection: isRtl ? 'right-to-left' : 'left-to-right',
      })
      .hyperlink(R.path(['copyright', 'link'], footerProps));

    workbook
      .sheet(0)
      .cell(getPosition(rowIndex + 1, startTablePosition + tableFullLength + 1))
      .value(R.path(['source', 'label'], footerProps))
      .style({ fontColor: '0563c1', underline: true })
      .hyperlink(R.path(['source', 'link'], footerProps));

    const maxStringLengthColRange = (columnIndex) =>
      workbook
        .sheet(0)
        .range(
          `${getPosition(
            beginRowIndex,
            startTablePosition + columnIndex,
          )}:${getPosition(
            endRowIndex,
            startTablePosition + tableFullLength + columnIndex,
          )}`,
        )
        .reduce((max, cell) => {
          const value = cell.value();
          if (R.isNil(value)) return max;
          if (!cell.contentShouldBeFitToCell) return max;
          return Math.max(max, R.pipe(R.toString, R.length, R.add(2))(value));
        }, 0);

    const maxStringLengthRowRange = (sectionRowIndex) =>
      workbook
        .sheet(0)
        .range(
          `${getPosition(sectionRowIndex, startTablePosition)}:${getPosition(
            sectionRowIndex,
            startTablePosition + tableFullLength - 1,
          )}`,
        )
        .reduce((max, cell) => {
          const value = cell.value();
          if (value === undefined) return max;
          return Math.max(max, value.toString().length);
        }, 0);

    // Set width for columns
    let maxWidths = [];
    R.forEach((columnIndex) => {
      const width = maxStringLengthColRange(columnIndex);
      maxWidths = R.append(width)(maxWidths);
      workbook
        .sheet(0)
        .column(startTablePosition + columnIndex)
        .width(R.ifElse(R.flip(R.gt)(20), R.always(20), R.identity)(width));
    })(R.times(R.identity, tableFullLength + spaceLength));

    // Set height for sections only
    const lengthOfFirstColumn = R.head(maxWidths);
    R.forEach((sectionRowIndex) => {
      workbook
        .sheet(0)
        .row(sectionRowIndex)
        .height(
          R.pipe(
            R.flip(R.divide)(lengthOfFirstColumn),
            Math.floor,
            R.ifElse(R.flip(R.lt)(1), R.always(1), R.identity),
            R.multiply(14.4), // height for one line
          )(maxStringLengthRowRange(sectionRowIndex)),
        );
    })(sectionRowIndexes);
    //// overview register
    registerOverview(
      workbook,
      R.assoc('copyright', R.prop('copyright', footerProps), overviewProps),
    );
    workbook.activeSheet(SHEET1);
    return workbook;
  });
};
