import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Button, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  AccessibilityFilled,
  AccessibilityOutlined,
} from '@sis-cc/dotstatsuite-visions';
import { FormattedMessage, formatMessage } from '../i18n';
import { getHasAccessibility } from '../selectors/router';
import { changeHasAccessibility } from '../ducks/app';
import messages from './messages';

const AccessibilityButton: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const hasAccessibility = useSelector(getHasAccessibility);

  const tooltipTitle = hasAccessibility ? (
    <FormattedMessage id="accessibility.disable" />
  ) : (
    <FormattedMessage id="accessibility.enable" />
  );

  const ariaLabel = hasAccessibility
    ? formatMessage(intl)(messages.accessibilitySupportEnabled)
    : formatMessage(intl)(messages.accessibilitySupportDisabled);

  // Custom icon wrapper for vision icons
  const AccessibilityIcon = hasAccessibility 
    ? AccessibilityFilled 
    : AccessibilityOutlined;

  return (
    <Tooltip 
      placement="bottom"
      title={tooltipTitle}
    >
      <Button
        type="text"
        icon={<AccessibilityIcon color="primary" />}
        aria-label={ariaLabel}
        aria-pressed={hasAccessibility}
        onClick={() => dispatch(changeHasAccessibility(!hasAccessibility))}
        size="large"
      />
    </Tooltip>
  );
};

export default AccessibilityButton;
