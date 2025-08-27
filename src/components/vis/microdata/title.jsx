import React from 'react';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from '../../../i18n';
import useMicrodataTable from '../../../hooks/useMicrodataTable';
import useSdmxMicrodata from '../../../hooks/useSdmxMicrodata';

const Title = () => {
  const { isLoading } = useSdmxMicrodata();
  const { count } = useMicrodataTable();
  if (isLoading) return null;

  return (
    <Typography variant="body2" tabIndex={0}>
      <FormattedMessage id="microdata.count" values={{ count }} />
    </Typography>
  );
};

export default Title;
