import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import cx from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { rules, rules2 } from '@sis-cc/dotstatsuite-components';
import { FormattedMessage } from '../../../i18n';
import { getIsRtl, getDisplay } from '../../../selectors/router';
import useMicrodataTable from '../../../hooks/useMicrodataTable';

const cellStyle = {
  borderLeft: `1px solid #A4A1A1`,
  borderBottom: `1px solid #A4A1A1`,
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.43,
  padding: '4px 8px',
  zIndex: 1,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  stickyHeader: {
    position: 'sticky',
    zIndex: 2,
  },
  table: {
    borderCollapse: 'separate',
    borderTop: `1px solid #A4A1A1`,
  },
  column: {
    ...cellStyle,
    whiteSpace: 'wrap',
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  row: {
    position: 'sticky',
    zIndex: 2,
    color: theme.palette.grey['A700'],
    backgroundColor:
      R.path(['palette', 'tertiary', 'light'])(theme) ||
      theme.palette.secondary.light,
  },
  cell: {
    ...cellStyle,
  },
  lastDim: {
    borderRight: `1px solid #A4A1A1`,
  },
  firstAttr: {
    borderLeft: '0px',
  },
  hover: {
    '&:hover': {
      backgroundColor: '#FEF4E6 !important', // theme override
    },
  },
}));
const getCellsWidth = R.addIndex(R.reduce)(
  (acc, element, index) =>
    R.append(R.add(acc[index], R.propOr(0, 'clientWidth', element)), acc),
  [0],
);
const MicrodataTable = ({ displayAccessor = R.identity }) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [dimensionCellsWidth, setDimensionCellsWidth] = useState([0]);
  const isRtl = useSelector(getIsRtl);
  const display = useSelector(getDisplay);
  const { rows, columns } = useMicrodataTable();
  const dimsLength = R.pipe(
    R.filter(R.propEq('dimension', 'type')),
    R.length,
  )(columns);

  const rowRef = useRef(null);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    setDimensionCellsWidth(
      getCellsWidth(R.pathOr([0], ['current', 'cells'], rowRef)),
    );
  }, [columns, rows, rowRef]);

  const currentRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className={classes.root} data-testid="microdata-table">
      <Table aria-label="sticky table" className={classes.table}>
        <TableHead className={classes.stickyHeader} style={{ top: 0 }}>
          <TableRow>
            {columns.map((column, idx) => (
              <TableCell
                key={column.id}
                align={R.defaultTo('left', column.align)}
                className={cx(classes.column, {
                  [classes.stickyHeader]: R.propEq('dimension', 'type', column),
                })}
                style={
                  isRtl
                    ? {
                        right: dimensionCellsWidth[idx],
                        minWidth: column.minWidth,
                      }
                    : {
                        left: dimensionCellsWidth[idx],
                        minWidth: column.minWidth,
                      }
                }
              >
                {R.equals(column.id, 'value') ? (
                  <FormattedMessage id="microdata.value" />
                ) : (
                  displayAccessor(column)
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {R.addIndex(R.map)(
            (row, rowIndex) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={`row-${rowIndex}`}
                classes={{ hover: classes.hover }}
                ref={rowRef}
              >
                {columns.map((column, idx) => {
                  const cell = R.nth(idx, row);
                  const value = R.ifElse(
                    R.is(Object),
                    R.pipe(
                      R.prop('value'),
                      R.converge(
                        (label, spaces) => `${spaces}${label}`,
                        [
                          (val) => rules2.getTableLabelAccessor(display)(val),
                          R.pipe(
                            R.propOr([], ['parents']),
                            R.when(R.isNil, R.always([])),
                            R.length,

                            R.times(() => '·  '),
                            R.join(''),
                          ),
                        ],
                      ),
                    ),
                    (cell) =>
                      R.isNil(cell) ? '' : rules.getCellValue({ value: cell }),
                  )(cell);
                  return (
                    <TableCell
                      key={column.id}
                      align={R.defaultTo('left', column.align)}
                      className={cx(classes.cell, {
                        [classes.row]: idx < dimsLength,
                        [classes.lastDim]:
                          idx === dimsLength - 1 ||
                          idx === R.length(columns) - 1,
                        [classes.firstAttr]: idx === dimsLength,
                      })}
                      style={
                        isRtl
                          ? { right: dimensionCellsWidth[idx] }
                          : { left: dimensionCellsWidth[idx] }
                      }
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ),
            currentRows,
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[100, 1000]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

MicrodataTable.propTypes = {
  displayAccessor: PropTypes.func,
};

export default MicrodataTable;
