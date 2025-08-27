import React, { useState, useRef, useEffect } from 'react';
import * as R from 'ramda';
import axios from 'axios';
import { useIntl, defineMessages } from 'react-intl';
import {
  Contact as ContactUs,
  Tooltip,
  Alert,
} from '@sis-cc/dotstatsuite-visions';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Dialog from '@mui/material/Dialog';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FormattedMessage, formatMessage } from '../i18n';
import Captcha from './captcha';
import { renameKeys } from '../utils';
import { getAsset, getContactMailTo, hasContactCaptcha } from '../lib/settings';
import { useSelector } from 'react-redux';
import { getUser } from '../selectors/app.js';
import { getLocale, getPathname } from '../selectors/router';
import { FEEDBACK, PROBLEM, QUESTION } from '../utils/constants';
import useTooltip from '../hooks/useTooltip';

const messages = defineMessages({
  wcagContact: { id: 'de.wcag.contact' },
  wcagClose: { id: 'de.wcag.close' },
  contactDetails: { id: 'de.contact.details' },
  contactEmail: { id: 'de.contact.email' },
  contactSubmit: { id: 'de.contact.submit.label' },
  contactFeedbackDetails: { id: 'de.contact.choice.feedback.details' },
  contactProblemDetails: { id: 'de.contact.choice.problem.details' },
  contactQuestionDetails: { id: 'de.contact.choice.question.details' },
  [FEEDBACK]: { id: 'de.contact.choice.feedback' },
  [PROBLEM]: { id: 'de.contact.choice.problem' },
  [QUESTION]: { id: 'de.contact.choice.question' },
  mailMode: { id: 'de.mail.mode' },
  mailPersonnalTitle: { id: 'de.mail.personnal.title' },
  mailFullName: { id: 'de.mail.full.name' },
  mailOrganisation: { id: 'de.mail.organisation' },
  mailAdressMail: { id: 'de.mail.adress.mail' },
  mailDetails: { id: 'de.mail.details' },
  mailCheckBox: { id: 'de.mail.check.box' },
  yes: { id: 'de.yes' },
  no: { id: 'de.no' },
  siteName: { id: 'de.app.title.search' },
  subject: { id: 'de.contact.mail.subject' },
  subjectLabel: { id: 'de.contact.mail.subject.label' },
  url: { id: 'de.mail.url' },
});

const useStyles = makeStyles((theme) => ({
  notifContainer: {
    position: 'absolute',
    right: 0,
    top: 70,
    marginRight: 2,
    zIndex: theme.zIndex.snackbar,
  },
  notifContainerVis: {
    position: 'absolute',
    right: 0,
    top: 130,
    marginRight: 2,
    zIndex: theme.zIndex.snackbar,
  },
  container: {
    margin: theme.spacing(1, 1, 0, 0),
  },
  reducedIcon: {
    minWidth: 0,
    marginRight: 10,
  },
}));

const formRequest = async (body) => {
  const res = await axios.post('/api/contact/form', body);
  return { isSuccess: res?.status === 200 };
};

const Contact = () => {
  const intl = useIntl();
  const classes = useStyles();
  const localeId = useSelector(getLocale);
  const [openContact, setOpenContact] = React.useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(hasContactCaptcha);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNotifMessageSuccess, setIsNotifMessageSuccess] = useState(false);
  const user = useSelector(getUser);
  const isFixed = useSelector(getPathname) === '/vis';
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const modes = [
    {
      value: QUESTION,
      label: formatMessage(intl)(messages[QUESTION]),
      message: formatMessage(intl)(messages.contactQuestionDetails),
    },
    {
      value: PROBLEM,
      label: formatMessage(intl)(messages[PROBLEM]),
      message: formatMessage(intl)(messages.contactProblemDetails),
    },
    {
      value: FEEDBACK,
      label: formatMessage(intl)(messages[FEEDBACK]),
      message: formatMessage(intl)(messages.contactFeedbackDetails),
    },
  ];

  const handleClickOpen = () => {
    setOpenContact(true);
  };

  const handleClose = () => {
    setOpenContact(false);
    setIsSubmitDisable(true);
  };

  const prepareForm = async (formProps) => {
    const mailsLabels = {
      mode: formatMessage(intl)(messages.mailMode),
      title: formatMessage(intl)(messages.mailPersonnalTitle),
      name: formatMessage(intl)(messages.mailFullName),
      organisation: formatMessage(intl)(messages.mailOrganisation),
      email: formatMessage(intl)(messages.mailAdressMail),
      subject: formatMessage(intl)(messages.subjectLabel),
      details: formatMessage(intl)(messages.mailDetails),
      url: formatMessage(intl)(messages.url),
      checkbox: formatMessage(intl)(messages.mailCheckBox),
    };
    const enhancedFormProps = R.pipe(
      R.evolve({
        mode: () => formatMessage(intl)(messages[formProps.mode]),
        checkbox: (isChecked) =>
          formatMessage(intl)(isChecked ? messages.yes : messages.no),
      }),
      R.assoc('url', window.location.href),
      renameKeys(mailsLabels),
      R.assoc(
        'subject',
        formatMessage(intl)(messages.subject, {
          about: formatMessage(intl)(messages[formProps.mode]),
          appName: formatMessage(intl)(messages.siteName),
          content: formProps.subject,
        }),
      ),
      (props) => {
        const logo = getAsset('mailHeader', localeId);
        if (R.isEmpty(logo) || R.isNil(logo)) return props;
        return R.assoc('logo', R.concat(window.location.origin, logo), props);
      },
      R.assoc('mailTo', getContactMailTo(formProps.mode)),
      R.assoc('mailFrom', formProps.email),
    )(formProps);

    const { isSuccess } = await formRequest(enhancedFormProps);
    setOpenContact(false);
    setIsNotifOpen(true);
    setIsNotifMessageSuccess(isSuccess);
  };

  const notifRef = useRef();

  useEffect(() => {
    if (notifRef && isNotifOpen) return;
    const eventListener = () => {
      setIsNotifOpen(false);
    };
    window.addEventListener('click', eventListener);

    return () => {
      window.removeEventListener('click', eventListener);
    };
  }, [notifRef]);
  const { open, onOpen, onClose } = useTooltip();

  return (
    <>
      {!isXs && (
        <Tooltip
          placement="bottom"
          variant="light"
          title={
            <Container>
              <FormattedMessage id="de.contact.form" />
            </Container>
          }
          open={open}
          onOpen={onOpen}
          onClose={onClose}
        >
          <IconButton
            aria-label={formatMessage(intl)(messages.wcagContact)}
            onClick={handleClickOpen}
            style={{ marginBottom: '3px' }}
            size="large"
          >
            <ContactSupportIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
      {isXs && (
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon
            aria-label={formatMessage(intl)(messages.wcagContact)}
            className={classes.reducedIcon}
          >
            <ContactSupportIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="de.contact.form" />
          </ListItemText>
        </MenuItem>
      )}
      <Dialog
        open={openContact}
        maxWidth={'md'}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Paper elevation={0} className={classes.container}>
          <IconButton
            style={{ float: 'right' }}
            size="small"
            color="primary"
            onClick={handleClose}
            aria-label={formatMessage(intl)(messages.wcagClose)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <ContactUs
            isSubmitDisable={isSubmitDisable}
            defaultMode="question"
            defaultFullName={R.trim(
              R.join(' ', [user?.family_name, user?.given_name]),
            )}
            defaultEmail={user?.email}
            modes={modes}
            send={prepareForm}
            labels={{
              modeTitle: <FormattedMessage id="de.contact.choice.title" />,
              personalTitle: (
                <FormattedMessage id="de.contact.personal.title" />
              ),
              name: <FormattedMessage id="de.contact.full.name" />,
              organisation: <FormattedMessage id="de.contact.organisation" />,
              checkbox: <FormattedMessage id="de.contact.checkbox" />,
              email: formatMessage(intl)(messages.contactEmail),
              details: formatMessage(intl)(messages.contactDetails),
              submit: formatMessage(intl)(messages.contactSubmit),
              organisationPrivacyPolicy: (
                <FormattedMessage id="de.contact.privacy" />
              ),
              subject: formatMessage(intl)(messages.subjectLabel),
            }}
          >
            {hasContactCaptcha && (
              <Captcha
                callback={({ isSuccess }) => {
                  setIsSubmitDisable(!isSuccess);
                  if (!isSuccess) {
                    setIsNotifOpen(true);
                    setIsNotifMessageSuccess(false);
                  }
                }}
              />
            )}
          </ContactUs>
        </Paper>
      </Dialog>
      <div
        className={isFixed ? classes.notifContainerVis : classes.notifContainer}
      >
        <Collapse in={isNotifOpen}>
          <Alert
            ref={notifRef}
            severity={isNotifMessageSuccess ? 'success' : 'error'}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setIsNotifOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {isNotifMessageSuccess ? (
              <FormattedMessage id="de.notif.contact.success" />
            ) : (
              <FormattedMessage id="de.notif.contact.error" />
            )}
          </Alert>
        </Collapse>
      </div>
    </>
  );
};

export default Contact;
