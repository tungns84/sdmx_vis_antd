import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import {
  AccessibilityFilled,
  AccessibilityOutlined,
  Tooltip,
} from '@sis-cc/dotstatsuite-visions';
import { FormattedMessage, formatMessage } from '../i18n';
import { getHasAccessibility } from '../selectors/router';
import { changeHasAccessibility } from '../ducks/app';
import messages from './messages';
import useTooltip from '../hooks/useTooltip';

const AccessibilityButton = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const hasAccessibility = useSelector(getHasAccessibility);
  const { open, onOpen, onClose } = useTooltip();

  return (
    <Tooltip
      placement="bottom"
      variant="light"
      title={
        <Container>
          {hasAccessibility ? (
            <FormattedMessage id="accessibility.disable" />
          ) : (
            <FormattedMessage id="accessibility.enable" />
          )}
        </Container>
      }
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <IconButton
        aria-label={
          hasAccessibility
            ? formatMessage(intl)(messages.accessibilitySupportEnabled)
            : formatMessage(intl)(messages.accessibilitySupportDisabled)
        }
        aria-pressed={hasAccessibility}
        onClick={() => dispatch(changeHasAccessibility(!hasAccessibility))}
        size="large"
      >
        {hasAccessibility ? (
          <AccessibilityFilled color="primary" />
        ) : (
          <AccessibilityOutlined color="primary" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default AccessibilityButton;
