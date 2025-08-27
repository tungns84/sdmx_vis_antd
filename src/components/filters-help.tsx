import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from '@sis-cc/dotstatsuite-visions';
import { BulbOutlined } from '@ant-design/icons';
import { Typography, Row, Col, Space } from 'antd';
import { FormattedMessage, formatMessage } from '../i18n';
import messages from './messages';
import useTooltip from '../hooks/useTooltip';
import styles from './filters-help.module.css';

const { Text } = Typography;
const FILTERS_ID = 'filters';

interface FiltersHelpProps {
  isSearch?: boolean;
}

/**
 * FiltersHelp Component
 * Migrated from MUI to AntD
 * - Grid → Row/Col
 * - Typography → AntD Typography
 * - HelpIcon → BulbOutlined
 * - makeStyles → CSS modules
 */
const FiltersHelp: React.FC<FiltersHelpProps> = ({ isSearch }) => {
  const intl = useIntl();
  const { open, onOpen, onClose } = useTooltip();

  return (
    <Row align="middle" data-testid="filters-help">
      <Col>
        <Text
          className={styles.root}
          id={FILTERS_ID}
          tabIndex={0}
        >
          {isSearch ? (
            <FormattedMessage id="de.side.filters.result" />
          ) : (
            <FormattedMessage id="de.side.filters.action" />
          )}
        </Text>
      </Col>
      {isSearch && (
        <Col>
          <Tooltip
            variant="light"
            tabIndex={0}
            aria-label={formatMessage(intl)(messages.help)}
            aria-hidden={false}
            placement="bottom-start"
            title={
              <Text id="filtersHelpers">
                <FormattedMessage
                  id="de.filters.search.help"
                  values={{ 
                    icon: <span className={styles.dotIcon}>•</span>
                  }}
                />
              </Text>
            }
            open={open}
            onOpen={onOpen}
            onClose={onClose}
          >
            <BulbOutlined className={styles.helpIcon} />
          </Tooltip>
        </Col>
      )}
    </Row>
  );
};

export default FiltersHelp;
