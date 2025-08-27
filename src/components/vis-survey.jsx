import React from 'react';
import PopupSurvey from './PopupSurvey';
import usePopupSurvey from '../hooks/usePopupSurvey';

const VisSurvey = () => {
  const { isShowing, surveyLink, surveyImage, hasSurvey } = usePopupSurvey();

  if (!hasSurvey) return null;

  return (
    <PopupSurvey url={surveyLink} img={surveyImage} isShowing={isShowing} />
  );
};

export default VisSurvey;
