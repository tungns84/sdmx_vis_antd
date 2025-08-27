import React from 'react';
import { withProfiler } from '@sentry/react';
import ActionButton from '../visions/DeToolBar/ActionButton';

const Button = (props) => <ActionButton {...props} />;

const makeButton = (name) => withProfiler(Button, { name });

export default makeButton('Action button');
export const ProfiledDownloadExcelButton = makeButton('Download excel button');
