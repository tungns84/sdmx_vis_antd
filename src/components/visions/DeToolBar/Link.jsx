import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import MuiButton from '@mui/material/Button';

const Link = ({
  classes,
  id,
  label,
  link,
  img,
  callback,
  disabled,
  filename,
  justifyContent,
}) => (
  <MuiButton
    key={id}
    component="a"
    color="primary"
    href={link}
    onClick={callback}
    className={justifyContent === 'start' ? classes.linkStart : classes.linkEnd}
    id={id}
    tabIndex={0}
    download={filename}
    disabled={!!disabled}
  >
    {R.not(R.isNil(img)) && (
      <img src={img} className={classes.linkIcon} alt="" /> //The image is decorative so it's better to not have alt text (wcag)
    )}
    {label}
  </MuiButton>
);
Link.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string,
  link: PropTypes.string,
  img: PropTypes.string,
  callback: PropTypes.func,
  disabled: PropTypes.bool,
  filename: PropTypes.string,
  justifyContent: PropTypes.string,
};

export default Link;
