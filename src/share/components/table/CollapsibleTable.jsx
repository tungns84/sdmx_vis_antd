import React from 'react';
import * as R from 'ramda';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { NoData } from '@sis-cc/dotstatsuite-visions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Row from './Row';
import Cell from './Cell';
import { FormattedMessage } from '../../../i18n';
import { DESC, sortByNumberId } from '../../../utils/sort';

// colLength is the number of columns + 1 hide in the collapse component (see Row)
const CollapsibleTable = ({
  viewerId,
  token,
  hasNodata,
  sharedObjects = [],
  dispatch,
  colLength = 11,
}) => {
  const theme = useTheme();
  const isUpSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const isUpLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const isNarrow = useMediaQuery(theme.breakpoints.only('xs'));

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {isUpSmall && (
              <>
                <Cell />
                <Cell align="left">
                  <FormattedMessage id="de.share.table.col.title" />
                </Cell>
              </>
            )}
            {isUpLarge && (
              <>
                <Cell align="left">
                  <FormattedMessage id="de.share.table.col.created" />
                </Cell>
                <Cell align="left">
                  <FormattedMessage id="de.share.table.col.lastViewed" />
                </Cell>
                <Cell align="left">
                  <FormattedMessage id="de.share.table.col.expireDate" />
                </Cell>
                <Cell align="left">
                  <FormattedMessage id="de.share.table.col.link" />
                </Cell>
              </>
            )}
            {isUpSmall && (
              <Cell align="left">
                <FormattedMessage id="de.share.table.col.shareOptions" />
              </Cell>
            )}
            {isUpLarge && (
              <Cell align="center">
                <FormattedMessage id="de.share.table.col.actions" />
              </Cell>
            )}
            <Cell />
          </TableRow>
        </TableHead>
        <TableBody>
          {R.isEmpty(sharedObjects) || hasNodata ? (
            <TableRow>
              <Cell align="center" colSpan={colLength}>
                <NoData
                  message={<FormattedMessage id="de.share.table.no.data" />}
                />
              </Cell>
            </TableRow>
          ) : (
            R.map(
              (sharedObject) => (
                <Row
                  key={sharedObject.id}
                  row={sharedObject}
                  viewerId={viewerId}
                  colLength={colLength}
                  token={token}
                  dispatch={dispatch}
                  isUpSmall={isUpSmall}
                  isUpLarge={isUpLarge}
                  isNarrow={isNarrow}
                />
              ),
              sortByNumberId(DESC)(sharedObjects),
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
