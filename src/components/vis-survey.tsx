import React from 'react';
import { Modal, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import usePopupSurvey from '../hooks/usePopupSurvey';

/**
 * VisSurvey Component
 * Shows survey popup if configured
 * Migrated to TypeScript (simplified)
 */
const VisSurvey: React.FC = () => {
  const { isShowing, surveyLink, surveyImage, hasSurvey } = usePopupSurvey();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isShowing && hasSurvey) {
      setVisible(true);
    }
  }, [isShowing, hasSurvey]);

  if (!hasSurvey) return null;

  return (
    <Modal
      title="Survey"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="close" onClick={() => setVisible(false)}>
          Close
        </Button>,
        <Button
          key="survey"
          type="primary"
          icon={<QuestionCircleOutlined />}
          onClick={() => {
            window.open(surveyLink, '_blank');
            setVisible(false);
          }}
        >
          Take Survey
        </Button>,
      ]}
    >
      {surveyImage && (
        <img 
          src={surveyImage} 
          alt="Survey" 
          style={{ width: '100%', maxWidth: '400px' }} 
        />
      )}
      <p>We'd love to hear your feedback! Please take a moment to complete our survey.</p>
    </Modal>
  );
};

export default VisSurvey;
