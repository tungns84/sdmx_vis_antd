import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import Link from '@mui/material/Link';
import { useIntl } from 'react-intl';
import { FormattedMessage, formatMessage } from '../../i18n';
import { ApiQueries as VisionsApiQueries } from '@sis-cc/dotstatsuite-visions';
import { getDataflow } from '../../selectors/router';
import {
  getDataUrl,
  getIsDataUrlTooLong,
  getStructureUrl,
} from '../../selectors/sdmx';
import { viewer } from '../../lib/settings';
import { apiQueriesMessages } from '../messages';
import { copyApiQuery } from '../../ducks/sdmx';

export const ApiQueries = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const dataflow = useSelector(getDataflow);
  const flatDataUrl = useSelector(getDataUrl({ agnostic: false }));
  const timeDataUrl = useSelector(getDataUrl({ agnostic: true }));
  const structureUrl = useSelector(getStructureUrl);
  const isDataUrlTooLong = useSelector(getIsDataUrlTooLong);

  if (R.isEmpty(dataflow)) return null;

  const queries = [
    {
      id: 'data',
      title: formatMessage(intl)(apiQueriesMessages.dataTitle),
      contents: isDataUrlTooLong
        ? [
            {
              id: 'flat',
              value: formatMessage(intl)(apiQueriesMessages.dataUrlTooLong),
              isError: true,
            },
          ]
        : [
            {
              id: 'flat',
              label: formatMessage(intl)(apiQueriesMessages.flatFormat),
              value: flatDataUrl,
            },
            {
              id: 'time',
              label: formatMessage(intl)(apiQueriesMessages.timeSeries),
              value: timeDataUrl,
            },
          ],
    },
    {
      id: 'structure',
      title: formatMessage(intl)(apiQueriesMessages.structureTitle),
      contents: [{ id: 'structure', value: structureUrl }],
    },
  ];
  const handleClick = () => dispatch(copyApiQuery());
  const labels = {
    title: <FormattedMessage id="de.api.queries.title" />,
    copy: formatMessage(intl)(apiQueriesMessages.copy),
    copied: formatMessage(intl)(apiQueriesMessages.copied),
    notice: <FormattedMessage id="de.api.queries.information" />,
    buttonsLabel: <FormattedMessage id="de.api.queries.format.label" />,
    descriptions: [
      <FormattedMessage
        id="de.api.queries.notice"
        key="de.api.queries.notice"
        values={{
          docLink: (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={viewer.api.doc}
            >
              <FormattedMessage id="de.api.queries.doc" />
            </Link>
          ),
          contactLink: (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={viewer.api.contact}
            >
              <FormattedMessage id="de.api.queries.contact" />
            </Link>
          ),
        }}
      />,
    ],
  };

  return (
    <VisionsApiQueries
      queries={queries}
      labels={labels}
      delay={1000}
      handleClick={handleClick}
    />
  );
};

export default ApiQueries;
