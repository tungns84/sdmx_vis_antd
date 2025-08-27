import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import {
  getHasCsvDlStart,
  getHasDownloadedExcel,
  getHasDownloadedPng,
  getHasShared,
} from '../selectors';
import { getLocale } from '../selectors/router';
import { getApp, getAsset } from '../lib/settings';
import { getIsApiQueryCopied } from '../selectors/sdmx';

export default () => {
  const hasShared = useSelector(getHasShared);
  const hasCsvDlStart = useSelector(getHasCsvDlStart);
  const hasDownloadedExcelFile = useSelector(getHasDownloadedExcel);
  const hasDownloadedPng = useSelector(getHasDownloadedPng);
  const isApiQueryCopied = useSelector(getIsApiQueryCopied);
  const localeId = useSelector(getLocale);
  const surveyLink = getApp('surveyLink', localeId);
  const surveyImage = getAsset('surveyImage', localeId);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsShowing(true), 60000);
  }, []);

  const isPopping = R.pipe(
    R.filter((el) => !R.not(el)),
    R.ifElse(R.pipe(R.length, R.equals(1)), R.head, R.always(false)),
  )([
    hasShared,
    hasCsvDlStart,
    hasDownloadedExcelFile,
    hasDownloadedPng,
    isApiQueryCopied,
    isShowing,
  ]);

  return {
    hasSurvey: !R.isEmpty(surveyLink) && !R.isNil(surveyLink),
    isShowing: isPopping,
    surveyLink,
    surveyImage,
  };
};
