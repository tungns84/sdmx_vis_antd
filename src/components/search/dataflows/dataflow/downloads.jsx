import React from 'react';
import * as R from 'ramda';
import makeStyles from '@mui/styles/makeStyles';
import GetAppIcon from '@mui/icons-material/GetApp';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MuiButton from '@mui/material/Button';
import { FormattedMessage } from '../../../../i18n';
import { Button, Menu } from '../../../visions/DeToolBar/helpers';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
  link: {
    margin: 0,
    padding: theme.spacing(0.75, 2),
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'end',
  },
  linkIcon: {
    height: 20,
    paddingRight: theme.spacing(1),
    alignItems: 'center',
  },
}));

const Downloads = ({
  downloads,
  isDownloading,
  isExternalLoading,
  callback,
  externalResources,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
    callback(true);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    callback(false);
  };

  return (
    <>
      <Button
        startIcon={<GetAppIcon />}
        selected={Boolean(anchorEl)}
        loading={isDownloading}
        onClick={openMenu}
        aria-haspopup="true"
      >
        <FormattedMessage id="de.visualisation.toolbar.action.download" />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {R.map(
          ({ id, label, link, callback, filename }) => (
            <MuiButton
              key={id}
              component="a"
              color="primary"
              href={link}
              onClick={
                R.is(Function, callback) ? () => callback({ filename }) : null
              }
              className={classes.link}
              id={id}
              tabIndex={0}
              download={filename}
            >
              {label}
            </MuiButton>
          ),
          downloads,
        )}
        <Divider />
        {isExternalLoading && (
          <ListItemText
            primaryTypographyProps={{ color: 'primary', align: 'center' }}
          >
            <CircularProgress size={24} />
          </ListItemText>
        )}
        {R.and(R.not(isExternalLoading), R.isEmpty(externalResources)) && (
          <MenuItem dense disabled>
            <ListItemText primaryTypographyProps={{ color: 'primary' }}>
              <span>
                <FormattedMessage id="de.no.external.resources" />
              </span>
            </ListItemText>
          </MenuItem>
        )}
        {R.not(R.isEmpty(externalResources)) &&
          R.map(
            ({ id, label, link, img }) => (
              <MuiButton
                key={id}
                component="a"
                color="primary"
                href={link}
                className={classes.link}
                id={id}
                tabIndex={0}
                download
              >
                {R.not(R.isNil(img)) && (
                  <img
                    src={img}
                    className={classes.linkIcon}
                    alt="" //The image is decorative so it's better to not have alt text (wcag)
                  />
                )}
                {label}
              </MuiButton>
            ),
            externalResources,
          )}
      </Menu>
    </>
  );
};

export default Downloads;
