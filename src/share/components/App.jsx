import React, { useEffect, useState } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import cx from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AlertDialog from './AlertDialog';
import CollapsibleTable from './table/CollapsibleTable';
import ExpiredToken from './ExpiredToken';
import ActivateShareObject from './Activate';
import {
  openLink,
  requestChart,
  requestList,
  requestDeleteAll,
} from '../reducer';
import { useFetching } from '../useFetching';
import { useDialog } from './useDialog';
import { FormattedMessage } from '../../i18n';
import { getIsPending, getLog } from '../accessors';

const useStyles = makeStyles((theme) => ({
  page: {
    flexGrow: 1,
    maxWidth: 'unset',
  },
  listContainer: {
    marginTop: theme.spacing(4),
  },
  buttonsContainer: {
    height: '20vh',
  },
  listContent: {
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: theme.spacing(2),
    width: 'fit-content',
    alignSelf: 'center',
  },
}));

const App = ({ params, state = {}, dispatch }) => {
  const classes = useStyles();
  const intl = useIntl();
  const viewerId = R.prop('id', params);
  const token = R.prop('token', params);
  const email = R.prop('email', params);

  useFetching(() => requestChart(viewerId), [viewerId], dispatch);
  useFetching(() => requestList(token), [token], dispatch);
  const { isOpen, handleClose, handleOpen, handleDelete } = useDialog({
    action: (props) => dispatch(requestDeleteAll(props)(dispatch)),
  });

  const [isHide, setHide] = useState(true);

  const isListPending = getIsPending('list')(state);
  const logList = getLog('list', 'method')(state);

  useEffect(() => {
    if (state.confirmUrl) {
      window.open(state.confirmUrl, '_blank').focus();
      dispatch(openLink());
    }
  }, [state.confirmUrl]);

  useEffect(() => {
    if (state.chartStatus === 'CONFIRMED' || R.isNil(state.chartStatus))
      setHide(true);
    if (state.chartStatus === 'PENDING') setHide(false);
  }, [state.chartStatus]);

  const isNewTokenRequired =
    logList?.log?.statusCode === 401 || logList?.log?.error;
  const hasNodata = logList?.log?.statusCode === 404;

  return (
    <Container className={classes.page}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={cx({
          [classes.buttonsContainer]: R.not(isHide) || isNewTokenRequired,
        })}
      >
        {isNewTokenRequired && (
          <Grid item xs={12} sm={4}>
            <ExpiredToken email={email} state={state} dispatch={dispatch} />
          </Grid>
        )}
        {!isHide && !isNewTokenRequired && (
          <Grid item xs={12} md={4}>
            <ActivateShareObject token={token} dispatch={dispatch} />
          </Grid>
        )}
      </Grid>
      {!isNewTokenRequired && (
        <Grid
          container
          direction="column"
          justifyContent="center"
          className={classes.listContainer}
        >
          <Grid item xs={12}>
            <Typography variant="body2">
              <FormattedMessage id="de.share.title.table" />
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} className={classes.listContent}>
            {isListPending ? (
              <CircularProgress color="primary" />
            ) : (
              <CollapsibleTable
                viewerId={viewerId}
                token={token}
                hasNodata={hasNodata}
                sharedObjects={state.list}
                dispatch={dispatch}
              />
            )}
          </Grid>
          {R.length(state.list) > 1 && (
            <AlertDialog
              customButton={
                <Button
                  fullWidth={false}
                  alternative="siscc"
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                  disabled={R.isEmpty(state.list)}
                  className={classes.deleteButton}
                >
                  <FormattedMessage id="de.share.button.deleteAll" />
                </Button>
              }
              title={<FormattedMessage id="de.share.alert.deleteall.title" />}
              description={
                <FormattedMessage id="de.share.alert.deleteall.description" />
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
                onClick={() => handleDelete({ token })}
                color="primary"
              >
                <FormattedMessage id="de.share.alert.deleteall.confirm" />
              </Button>
            </AlertDialog>
          )}
          <Grid container item justifyContent="flex-end">
            <Link href={intl.formatMessage({ id: 'share.policy.link' })}>
              <FormattedMessage id="share.policy.label" />
            </Link>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

App.propTypes = {
  params: PropTypes.object,
  state: PropTypes.object,
  dispatch: PropTypes.func,
};

export default App;
