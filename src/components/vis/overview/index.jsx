import React from 'react';
import * as R from 'ramda';
import Link from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useIntl } from 'react-intl';
import { DataFooter, Tag } from '@sis-cc/dotstatsuite-visions';
import useOverview from '../../../hooks/useOverview';
import { formatMessage, FormattedMessage } from '../../../i18n';
import GroupLabels from './GroupLabels';
import SanitizedInnerHTML from '../../SanitizedInnerHTML';
import { ID_OVERVIEW_COMPONENT } from '../../../css-api';
import messages from '../../messages';

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: theme.palette.primary.light,
  },
  container: {
    margin: theme.spacing(1.25),
    [theme.breakpoints.down('xs')]: {
      margin: '10px 0 0',
    },
  },
  title: {
    fontSize: 18,
    ...R.pathOr({}, ['mixins', 'dataHeader', 'title'], theme),
  },
  textContainer: {
    margin: theme.spacing(1.25, 0, 0, 0),
  },
  listItem: {
    display: 'list-item',
    listStyle: 'disc',
  },
  iconSummaryPanel: {
    color: theme.palette.primary.main,
    padding: theme.spacing(0.5, 0.5),
    margin: theme.spacing(0, 1, 0, 0),
  },
  content: {
    display: 'flex',
    alignContent: 'space-between',
    margin: `${theme.spacing(0.5, 0)} !important`,
  },
  containerAccordion: {
    minHeight: '40px !important',
    maxHeight: 40,
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    padding: theme.spacing(0),
  },
  panel: {
    borderRadius: 'unset !important',
    '&$expanded': {
      marginTop: 0,
      marginBottom: theme.spacing(2),
    },
    '&:before': {
      backgroundColor: 'unset',
    },
  },
}));

const Overview = () => {
  const classes = useStyles();
  const intl = useIntl();
  const {
    footerProps,
    labelAccessor,
    selectedHierarchySchemes,
    externalResources,
    dataflowDescription,
    observationsCount,
    validFrom,
    oneDimensions,
    oneAttributes,
    dataSpaceLabel,
    homeFacetIds,
    title,
    lists,
    complementaryData,
    makeHierarchyProps,
  } = useOverview();
  const [displayedComplementaryData, hiddenComplementaryData] =
    complementaryData;
  const enhancedFooterProps = {
    copyright: {
      label: (
        <Link
          href={formatMessage(intl)(messages.viewerLink)}
          rel="noopener noreferrer"
          target="_blank"
          variant="body2"
          tabIndex={0}
        >
          <FormattedMessage id="de.viewer.copyright.label" />
        </Link>
      ),
      content: `${formatMessage(intl)(
        messages.viewerContentLabel,
      )} ${formatMessage(intl)(messages.viewerLinkLabel)}`,
    },
    ...footerProps,
  };

  return (
    <>
      <Divider className={classes.divider} />
      <div className={classes.container} id={ID_OVERVIEW_COMPONENT}>
        <Typography component="h1" variant="h1" className={classes.title}>
          {title}
        </Typography>
        {!R.isNil(dataflowDescription) && (
          <div className={classes.textContainer}>
            <Typography variant="body2">
              <SanitizedInnerHTML html={dataflowDescription} />
            </Typography>
          </div>
        )}
        <div className={classes.textContainer}>
          <div>
            <GroupLabels list={oneDimensions} accessor={labelAccessor} />
          </div>
          <div>
            <GroupLabels list={oneAttributes} accessor={labelAccessor} />
          </div>
        </div>
        <div className={classes.textContainer}>
          {R.addIndex(R.map)((hierarchies, index) => {
            const props = makeHierarchyProps(index, hierarchies);
            return (
              <GroupLabels key={`hierarchy-${index}`} isHierarchy {...props} />
            );
          }, selectedHierarchySchemes)}
          {homeFacetIds.has('datasourceId') && dataSpaceLabel && (
            <div>
              <GroupLabels list={lists['dataSource']} />
            </div>
          )}
        </div>
        <div className={classes.textContainer}>
          {!R.isNil(observationsCount) && (
            <div>
              <GroupLabels list={lists['observationsCount']} />
            </div>
          )}
          {validFrom && (
            <div>
              <GroupLabels list={lists['validFrom']} />
            </div>
          )}
        </div>
        {!R.isEmpty(externalResources) && (
          <div className={classes.textContainer}>
            <div>
              <GroupLabels
                list={lists['relatedFiles']}
                isValueVisible={false}
              />
            </div>
            <List dense>
              {R.map(
                ({ id, label, link }) => (
                  <ListItem key={id} dense>
                    <Link
                      target="_blank"
                      color="primary"
                      href={link}
                      classes={{ root: classes.listItem }}
                    >
                      {label}
                    </Link>
                  </ListItem>
                ),
                externalResources,
              )}
            </List>
          </div>
        )}
        {!R.isEmpty(displayedComplementaryData) && (
          <div
            className={classes.textContainer}
            data-testid="complementaryData"
          >
            <div>
              <GroupLabels
                list={lists['complementaryData']}
                isValueVisible={false}
              />
            </div>
            <List dense>
              {R.map(
                ({ dataflowId, label, url }) => (
                  <ListItem key={dataflowId} dense>
                    <Link
                      target="_blank"
                      color="primary"
                      href={url}
                      classes={{ root: classes.listItem }}
                    >
                      {label}
                    </Link>
                  </ListItem>
                ),
                displayedComplementaryData,
              )}
            </List>
            {!R.isEmpty(hiddenComplementaryData) && (
              <Accordion elevation={0} classes={{ root: classes.panel }}>
                <AccordionSummary
                  className={classes.containerAccordion}
                  classes={{
                    content: classes.content,
                    expandIcon: classes.iconSummaryPanel,
                  }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="body2" style={{ display: 'flex' }}>
                    <GroupLabels
                      list={lists['moreComplementaryData']}
                      isValueVisible={false}
                    />
                    <Tag>{R.length(hiddenComplementaryData)}</Tag>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: '8px 0px 16px' }}>
                  <List dense>
                    {R.map(
                      ({ dataflowId, label, url }) => (
                        <ListItem key={dataflowId} dense>
                          <Link
                            target="_blank"
                            color="primary"
                            href={url}
                            classes={{ root: classes.listItem }}
                          >
                            {label}
                          </Link>
                        </ListItem>
                      ),
                      hiddenComplementaryData,
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        )}
        <Divider className={classes.divider} />
        <DataFooter {...enhancedFooterProps} />
      </div>
    </>
  );
};

Overview.propTypes = {};

export default Overview;
