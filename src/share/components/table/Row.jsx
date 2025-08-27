import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import cx from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import GlobeIcon from '@mui/icons-material/Public';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import MailIcon from '@mui/icons-material/Mail';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  CopyContent as CopyContentIcon,
  Button,
} from '@sis-cc/dotstatsuite-visions';
import { useIntl } from 'react-intl';
import { getViewerLink, DATE_FORMAT, icons } from '../../constants';
import AlertDialog from '../AlertDialog';
import { useDialog } from '../useDialog';
import ViewerCell from './ViewerCell';
import Cell from './Cell';
import { requestDelete } from '../../reducer';
import { FormattedMessage } from '../../../i18n';
import Social from '../Social';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  cell: {
    whiteSpace: 'nowrap',
  },
  icon: {
    verticalAlign: 'middle',
    margin: `0 ${theme.spacing(0.5)}`,
    cursor: 'pointer',
  },
  code: {
    border: `4px solid ${theme.palette.grey[100]}`,
    padding: theme.spacing(1),
    userSelect: 'all',
  },
  tag: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.highlight.hl2,
    color: theme.palette.getContrastText(theme.palette.highlight.hl2),
    padding: theme.spacing(0.5),
    borderRadius: '4px',
  },
  copyCode: {
    position: 'relative',
    float: 'right',
    // margin: '0px 23px'
  },
  row: {
    backgroundColor: theme.palette.highlight.hl1,
  },
  cellChartIcon: {
    paddingRight: 0,
  },
}));

const Item = ({ title, value, direction = 'column', isNarrow }) => (
  <Grid item container direction={direction}>
    <Grid item xs={isNarrow ? 5 : false}>
      {title}
    </Grid>
    <Grid item xs={isNarrow ? 7 : false}>
      {value}
    </Grid>
  </Grid>
);

Item.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  direction: PropTypes.string,
  isNarrow: PropTypes.bool,
};

const getContent = (
  viewerUrl,
) => `<iframe src="${viewerUrl}" style="border: none"; allowfullscreen="true">;
    <a rel="noopener noreferrer" href="${viewerUrl}" target="_blank">Dataflow</a>
  </iframe>;
`;

const Row = ({
  row,
  colLength,
  viewerId,
  token,
  dispatch,
  isUpSmall,
  isUpLarge,
  isNarrow,
}) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const intl = useIntl();
  const Icon = R.propOr(GlobeIcon, R.path(['data', 'type'], row), icons);
  const id = R.prop('id', row);
  const title =
    R.path(['data', 'title'], row) ||
    `[${R.path(['data', 'dataflowId'], row)}]`;
  const viewerUrl = getViewerLink(R.prop('confirmUrl', row), id);
  const iframeContent = getContent(viewerUrl);
  const { selectedId, isOpen, handleClose, handleOpen, handleDelete } =
    useDialog({
      id,
      action: (props) => dispatch(requestDelete(props)(dispatch)),
    });

  const deleteDialog = (
    <AlertDialog
      Icon={DeleteIcon}
      title={<FormattedMessage id="de.share.alert.delete.title" />}
      description={
        <FormattedMessage
          id="de.share.alert.delete.description"
          values={{ title, id }}
        />
      }
      handleOpen={handleOpen}
      handleClose={handleClose}
      open={isOpen}
    >
      <Button onClick={handleClose} color="primary">
        <FormattedMessage id="de.share.alert.delete.cancel" />
      </Button>
      <Button
        alternative="siscc"
        variant="contained"
        onClick={() => handleDelete({ token, id })}
        color="primary"
      >
        <FormattedMessage id="de.share.alert.delete.confirm" />
      </Button>
    </AlertDialog>
  );
  const createdAt = intl.formatDate(R.prop('createdAt', row), DATE_FORMAT);
  const lastAccessedAt = intl.formatDate(
    R.prop('lastAccessedAt', row),
    DATE_FORMAT,
  );
  const expire = intl.formatDate(R.prop('expire', row), DATE_FORMAT);
  const links = <ViewerCell viewerUrl={viewerUrl} />;

  const socialList = [
    {
      id: 'newTab',
      Icon: OpenInNewIcon,
      link: viewerUrl,
    },
    {
      id: 'facebook',
      Icon: FacebookIcon,
      link: `https://www.facebook.com/sharer/sharer.php?u=${viewerUrl}`,
    },
    {
      id: 'linkedin',
      Icon: LinkedInIcon,
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${viewerUrl}`,
    },
    {
      id: 'twitter',
      Icon: TwitterIcon,
      link: `https://twitter.com/intent/tweet?text=${title}&url=${viewerUrl}`,
    },
    {
      id: 'mail',
      Icon: MailIcon,
      link: `mailto:?subject=Shared visualisation: ${title}&body=${viewerUrl}`,
    },
  ];

  return (
    <React.Fragment>
      <TableRow
        className={cx(classes.root, { [classes.row]: selectedId === id })}
      >
        <Cell align="right" className={classes.cellChartIcon}>
          <Icon className={classes.icon} />
        </Cell>
        <Cell align="left">
          {title}
          {viewerId === id && (
            <Typography className={classes.tag} component="span">
              <FormattedMessage id="de.share.tag.new.shared.object" />
            </Typography>
          )}
        </Cell>
        {isUpLarge && (
          <>
            <Cell align="left" className={classes.cell}>
              {createdAt}
            </Cell>
            <Cell align="left" className={classes.cell}>
              {lastAccessedAt}
            </Cell>
            <Cell align="left" className={classes.cell}>
              {expire}
            </Cell>
            <Cell align="left">{links}</Cell>
          </>
        )}
        {isUpSmall && (
          <Cell align="left">
            <Social
              links={R.drop(isUpLarge ? 1 : 0, socialList)}
              viewerUrl={viewerUrl}
            />
          </Cell>
        )}
        {isUpLarge && <Cell align="center">{deleteDialog}</Cell>}
        <Cell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon color="primary" />
            ) : (
              <KeyboardArrowDownIcon color="primary" />
            )}
          </IconButton>
        </Cell>
      </TableRow>
      <TableRow>
        <Cell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colLength}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container spacing={3}>
                {!isUpLarge && isUpSmall && (
                  <>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Item
                          title={
                            <FormattedMessage id="de.share.table.col.actions" />
                          }
                          value={deleteDialog}
                        />
                      </Grid>
                      <Grid item>
                        <Item
                          title={
                            <FormattedMessage id="de.share.table.col.link" />
                          }
                          value={links}
                        />
                      </Grid>
                      <Grid item>
                        <Item
                          title={
                            <FormattedMessage id="de.share.table.col.created" />
                          }
                          value={createdAt}
                        />
                      </Grid>
                      <Grid item>
                        <Item
                          title={
                            <FormattedMessage id="de.share.table.col.lastViewed" />
                          }
                          value={lastAccessedAt}
                        />
                      </Grid>
                      <Grid item>
                        <Item
                          title={
                            <FormattedMessage id="de.share.table.col.expireDate" />
                          }
                          value={expire}
                        />
                      </Grid>
                    </Grid>
                    <Typography style={{ padding: '12px' }}>
                      {<FormattedMessage id="de.share.embed.description" />}
                      {
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigator.clipboard.writeText(iframeContent)
                          }
                        >
                          <CopyContentIcon color="primary" fontSize="small" />
                        </IconButton>
                      }
                    </Typography>
                  </>
                )}
                {isNarrow && (
                  <Grid item container>
                    <Grid style={{ margin: 'auto' }}>
                      <Social
                        links={R.drop(0, socialList)}
                        viewerUrl={viewerUrl}
                      />
                    </Grid>
                    <Grid xs={12} style={{ padding: '12px' }}>
                      {' '}
                      {links}
                    </Grid>
                    <Grid container style={{ paddingBottom: '2px' }}>
                      <Item
                        title={
                          <FormattedMessage id="de.share.table.col.created" />
                        }
                        value={createdAt}
                        direction="row"
                        isNarrow={isNarrow}
                      />
                    </Grid>
                    <Grid container style={{ paddingBottom: '2px' }}>
                      <Item
                        title={
                          <FormattedMessage id="de.share.table.col.lastViewed" />
                        }
                        value={lastAccessedAt}
                        direction="row"
                        isNarrow={isNarrow}
                      />
                    </Grid>
                    <Grid container style={{ paddingBottom: '5px' }}>
                      <Item
                        title={
                          <FormattedMessage id="de.share.table.col.expireDate" />
                        }
                        value={expire}
                        direction="row"
                        isNarrow={isNarrow}
                      />
                    </Grid>
                    <Typography style={{ paddingBottom: '2px' }}>
                      {<FormattedMessage id="de.share.embed.description" />}
                      {
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigator.clipboard.writeText(iframeContent)
                          }
                        >
                          <CopyContentIcon color="primary" fontSize="small" />
                        </IconButton>
                      }
                    </Typography>
                    <Grid
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                      style={{ padding: '5px' }}
                    >
                      {deleteDialog}
                      {<FormattedMessage id="de.share.mobile.delete" />}
                    </Grid>
                  </Grid>
                )}
                {isUpLarge && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      gutterBottom
                      component="div"
                      style={{ marginRight: isUpLarge ? '58px' : 0 }}
                    >
                      <FormattedMessage id="de.share.embed.description" />
                      <IconButton size="small" className={classes.copyCode}>
                        <CopyContentIcon
                          color="primary"
                          className={cx({ [classes.copyCode]: isUpLarge })}
                          fontSize="small"
                          onClick={() =>
                            navigator.clipboard.writeText(iframeContent)
                          }
                        />
                      </IconButton>
                    </Typography>
                    <pre className={classes.code}>{iframeContent}</pre>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </Cell>
      </TableRow>
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.object,
  colLength: PropTypes.number,
  viewerId: PropTypes.string,
  token: PropTypes.string,
  dispatch: PropTypes.func,
  isUpSmall: PropTypes.bool,
  isUpLarge: PropTypes.bool,
  isNarrow: PropTypes.bool,
};

export default Row;
