import React, { useMemo, useState } from 'react';
import * as R from 'ramda';
import { Dataflow as VxDataflow } from '@sis-cc/dotstatsuite-visions';
import SanitizedInnerHTML from '../../../SanitizedInnerHTML';
import { useDispatch, useSelector } from 'react-redux';
import { changeDataflow, requestCsvDataFile } from '../../../../ducks/sdmx';
import { useIntl } from 'react-intl';
import { setHighlights } from '../../utils';
import Downloads from './downloads';
import useSdmxDataflowExternalResources from '../../../../hooks/sdmx/useSdmxDataflowExternalResources';
import { FormattedMessage, formatMessage } from '../../../../i18n';
import { visDlMessages } from '../../../messages';
import { getFilename } from '../../../../lib/sdmx';
import { DATE_OPTIONS, getCsvFileUrl, getLabel } from './utils';
import { getPending } from '../../../../selectors/app.js';
import { downloadableDataflowResults } from '../../../../lib/settings';

const Dataflow = ({ dataflow }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [isEnabled, setIsEnabled] = useState(false);

  const isPending = useSelector(getPending);
  const isDownloading = R.prop(`getDataFile/${dataflow.id}`, isPending);
  const {
    isFetching,
    externalReference,
    dataflowExternalResources = [],
  } = useSdmxDataflowExternalResources({
    dataflowResult: dataflow,
    isEnabled,
  });

  const handleUrl = (event) => {
    event.stopPropagation();
    if (event.ctrlKey) return;
    event.preventDefault();
    return dispatch(changeDataflow(dataflow));
  };

  const handleCSVDownload = ({ filename }) => {
    dispatch(requestCsvDataFile({ filename }));
  };

  const highlights = useMemo(() => {
    return R.map(setHighlights({ intl }), dataflow.highlights);
  }, [dataflow]);

  const download = {
    id: 'csv.all',
    callback: handleCSVDownload,
    label: formatMessage(intl)(R.prop('data.download.csv.all', visDlMessages)),
    link: getCsvFileUrl({ dataflowResult: dataflow, externalReference }),
    filename: getFilename({
      isFull: true,
      identifiers: { code: dataflow.dataflowId, ...dataflow },
    }),
  };

  return (
    <VxDataflow
      {...dataflow}
      HTMLRenderer={SanitizedInnerHTML}
      testId={dataflow.id}
      key={dataflow.id}
      id={dataflow.id}
      title={dataflow.name}
      body={{ description: dataflow.description }}
      url={dataflow.url}
      handleUrl={handleUrl}
      highlights={highlights}
      label={getLabel(dataflow)}
      labels={{
        dimensions: <FormattedMessage id="de.search.dataflow.dimensions" />,
        source: <FormattedMessage id="de.data.source" />,
        lastUpdated: <FormattedMessage id="de.search.dataflow.last.updated" />,
        note: `${dataflow.agencyId}:${dataflow.dataflowId}(${dataflow.version})`,
        date: intl.formatDate(dataflow.lastUpdated, DATE_OPTIONS),
      }}
    >
      {downloadableDataflowResults && (
        <Downloads
          downloads={[download]}
          isDownloading={isDownloading}
          isExternalLoading={isFetching}
          callback={setIsEnabled}
          externalResources={dataflowExternalResources}
        />
      )}
    </VxDataflow>
  );
};

export default Dataflow;
