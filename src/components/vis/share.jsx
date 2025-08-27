import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { useIntl } from 'react-intl';
import Link from '@mui/material/Link';
import useTheme from '@mui/material/styles/useTheme';
import { Share as VisionsShare } from '@sis-cc/dotstatsuite-visions';
import { changeUserEmail } from '../../ducks/user';
import { shareSuccess } from '../../ducks/vis';
import { getIsTimeInverted } from '../../selectors';
import {
  getDataflow,
  getDisplay,
  getIsShareable,
  getLocale,
} from '../../selectors/router';
import {
  getRawDataRequestArgs,
  getDataUrl,
  getTimeFormats,
} from '../../selectors/sdmx';
import { getLayoutIds } from '../../selectors/table';
import { getUserEmail } from '../../selectors/user';
import { FormattedMessage, formatMessage } from '../../i18n';
import messages from '../messages';
import { getAsset } from '../../lib/settings';
import { getShareData, getShareConfig } from '../../utils/viewer';
import { getUser } from '../../selectors/app.js';
import { expirationPeriod } from '../../utils/constants';
import shareApi from '../../api/share';
import useSdmxStructure from '../../hooks/useSdmxStructure';
import useMap from '../../hooks/chart/useMap';

const Share = ({ viewerProps }) => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const userEmail = user?.email;
  const customEmail = useSelector(getUserEmail);
  const theme = useTheme();
  const intl = useIntl();
  const [state, setState] = useState({
    isSharing: false,
    isMessageOpen: false,
    hasError: false,
  });
  const [mode, setMode] = useState('snapshot');
  const [email, setEmail] = useState(userEmail);
  const sdmxUrl = useSelector(getDataUrl({ agnostic: false }));
  const requestArgs = useSelector(getRawDataRequestArgs);
  const localeId = useSelector(getLocale);
  const dataflow = useSelector(getDataflow);
  const isTimeInverted = useSelector(getIsTimeInverted);
  const layoutIds = useSelector(getLayoutIds);
  const { map } = useMap();
  const display = useSelector(getDisplay);
  const timeFormats = useSelector(getTimeFormats);
  const { observationsType } = useSdmxStructure();
  const isShareable = useSelector(getIsShareable);

  useEffect(() => {
    if (customEmail) setEmail(customEmail);
  }, [customEmail]);

  const sendShare = useCallback(async () => {
    if (state.isSharing) return;
    const shareConfig = getShareConfig({
      mode,
      sdmxUrl,
      requestArgs,
      localeId,
      dataflow,
      isTimeInverted,
      layoutIds,
      map,
      display,
      timeFormats,
      observationsType,
    });
    const logo = getAsset('mailHeader', localeId);
    const title = R.pathOr(
      'Confirm your email',
      ['headerProps', 'title', 'label'],
      viewerProps,
    );

    let body = {
      data: getShareData(viewerProps, mode, shareConfig),
      email,
      subject: formatMessage(intl)(messages.subject, { title }),
      content: {
        headerMsg: formatMessage(intl)(messages.headerMsg),
        subHeaderMsg: formatMessage(intl)(messages.subHeaderMsg),
        copyMsg: formatMessage(intl)(messages.copyMsg),
        confirmationText: formatMessage(intl)(messages.confirmationText, {
          chartsTTL: expirationPeriod,
        }),
        buttonMsg: formatMessage(intl)(messages.buttonMsg),
      },
      css: {
        banner: theme.palette.tertiary.main,
        body: theme.palette.secondary.dark,
        button: theme.palette.primary.dark,
      },
    };
    if (!R.isNil(logo) && !R.isEmpty(logo)) {
      body.logo = R.concat(window.location.origin, logo);
    }
    setState(R.set(R.lensProp('isSharing'), true));

    await shareApi
      .create(body)
      .then(() => {
        setState(
          R.pipe(
            R.set(R.lensProp('hasError'), false),
            R.set(R.lensProp('isMessageOpen'), true),
          ),
        );
        dispatch(shareSuccess());
      })
      .catch(() =>
        setState(
          R.pipe(
            R.set(R.lensProp('hasError'), true),
            R.set(R.lensProp('isMessageOpen'), true),
          ),
        ),
      );

    if (email !== userEmail) dispatch(changeUserEmail(email));

    setState(R.set(R.lensProp('isSharing'), false));
  }, [state.isSharing, mode, email, viewerProps]);

  return (
    <VisionsShare
      share={sendShare}
      changeMode={setMode}
      changeIsMessageOpen={() =>
        setState(R.set(R.lensProp('isMessageOpen'), false))
      }
      changeMail={setEmail}
      isMessageOpen={state.isMessageOpen}
      isSharing={state.isSharing}
      mail={email}
      mode={isShareable ? mode : 'latest'}
      hasError={state.hasError}
      modes={[
        {
          label: <FormattedMessage id="share.snapshot" />,
          value: 'snapshot',
          disabled: !isShareable,
          warningMessage:
            !isShareable || user
              ? formatMessage(intl)(messages.sharePrivateData)
              : null,
        },
        {
          label: <FormattedMessage id="share.latest" />,
          value: 'latest',
        },
      ]}
      labels={{
        disclaimer: (
          <FormattedMessage
            id="share.disclaimer"
            values={{
              br: <br />,
              link: (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={formatMessage(intl)(messages.sharePolicyLink)}
                >
                  <FormattedMessage id="share.policy.label" />
                </Link>
              ),
            }}
          />
        ),
        email: <FormattedMessage id="share.mail" />,
        errorTitle: <FormattedMessage id="share.error.title" />,
        errorMessage: <FormattedMessage id="share.error.message" />,
        title: <FormattedMessage id="share.title" />,
        submit: formatMessage(intl)(messages.submit),
        successTitle: <FormattedMessage id="share.success.title" />,
        successMessage: <FormattedMessage id="share.success.message" />,
      }}
    />
  );
};

Share.propTypes = {
  viewerProps: PropTypes.object,
};

export default Share;
