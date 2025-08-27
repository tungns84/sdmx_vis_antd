import * as R from 'ramda';

const READ_PIT_PERMISSION = 2048;
const DATAFLOW_TYPE = 22;
const ALL_ARTEFACTS = 0;
const ALL = '*';

export const getReadPITPermissionInScope = (rights, dataflow) =>
  R.find(
    ({
      dataSpace,
      artefactType,
      artefactAgencyId,
      artefactId,
      artefactVersion,
      permission,
    }) => {
      const hasSpaceScope =
        dataSpace === ALL || dataSpace === dataflow.datasourceId;
      const hasDFScope =
        artefactType === ALL_ARTEFACTS || artefactType === DATAFLOW_TYPE;
      const hasAgencyScope =
        artefactAgencyId === ALL || artefactAgencyId === dataflow.agencyId;
      const hasIDScope =
        artefactId === ALL || artefactId === dataflow.dataflowId;
      const hasVersionScope =
        artefactVersion === ALL || artefactVersion === dataflow.version;
      const hasPermission =
        (permission & READ_PIT_PERMISSION) === READ_PIT_PERMISSION;

      return (
        hasSpaceScope &&
        hasDFScope &&
        hasAgencyScope &&
        hasIDScope &&
        hasVersionScope &&
        hasPermission
      );
    },
    rights,
  );
