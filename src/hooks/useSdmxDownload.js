import FileSaver from 'file-saver';
import * as R from 'ramda';
import useSdmxQuery from './sdmx/useSdmxQuery';

export default (ctx, { beforeHook, errorHandler }) => {
  const saveFile = ({ data, filename }) => {
    const BOM = '\uFEFF';
    const blob = new Blob([R.concat(BOM, R.prop('data')(data))], {
      type: 'text/csv;charset=utf-8',
    });
    return FileSaver.saveAs(blob, `${filename}.csv`);
  };

  const query = useSdmxQuery(ctx, {
    beforeHook,
    errorHandler,
    isEnabled: false,
    successHandler: ({ data }) => {
      saveFile({ data, filename: ctx.filename });
      query.remove();
    },
  });

  return {
    isLoading: R.prop(['isLoading'], query),
    download: () => query.refetch(),
    error: query.error,
  };
};
