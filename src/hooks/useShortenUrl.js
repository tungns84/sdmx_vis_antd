import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getToken } from '../selectors/app.js';
import { HTTP_AUTH_HEADER } from '../api/sdmx/utils';
import messages, { apiQueriesMessages } from '../components/messages';
import { formatMessage } from '../i18n';
import susApi from '../api/sus';
import { useMutation } from 'react-query';
import useGetUsedFilters from './useGetUsedFilters';

export default () => {
  const intl = useIntl();
  const selection = useGetUsedFilters();
  const [copied, setCopied] = useState(false);
  const [contentValue, setContentValue] = useState('');
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const token = useSelector(getToken);

  const body = { sourceUrl: window.location.href };
  const headers = { [HTTP_AUTH_HEADER]: `Bearer ${token}` };
  const ctx = { method: 'createOne', body, headers };
  const isNotEnabled = !token || copied;

  useEffect(() => {
    if (window.location.href !== url) {
      setContentValue('');
      setCopied(false);
    }
  }, [selection]);

  const mutation = useMutation(['sus'], (ctx) => susApi(ctx), {
    isNotCached: true,
    onSuccess: (data) => {
      setUrl(body.sourceUrl);
      setContentValue(data.shortenedUrl);
      navigator.clipboard.writeText(data.shortenedUrl);
      setCopied(true);
    },
    onError: () => {
      setIsNotifOpen(true);
      setErrorMessage(formatMessage(intl)(messages.logError));
    },
  });
  const { mutateAsync, isLoading } = mutation;

  const props = {
    labels: {
      title: formatMessage(intl)(messages.susTitle),
      generateUrl: copied
        ? formatMessage(intl)(apiQueriesMessages.copied)
        : formatMessage(intl)(messages.generateUrl),
      errorMessage,
    },
    contentValue,
    isLoading,
    isNotifOpen,
    setIsNotifOpen,
  };
  const shortenUrl = async () => {
    if (isNotEnabled) return;
    return await mutateAsync({ ...ctx });
  };
  return { props, shortenUrl };
};
