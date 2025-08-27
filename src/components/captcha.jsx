import React, { useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import PropTypes from 'prop-types';
import { getLocale } from '../selectors/router';

const endPoint = '/api/captcha/verify';

const Captcha = ({ callback }) => {
  const captchaRef = useRef();
  const locale = useSelector(getLocale);

  const handleSubmit = async (token) => {
    const {
      data: { isSuccess },
    } = await axios.post(endPoint, { token });
    callback({ isSuccess });
  };

  return (
    <ReCAPTCHA
      ref={captchaRef}
      theme={'light'}
      sitekey={window.CONFIG.captchaSiteKey}
      onChange={handleSubmit}
      hl={locale}
    />
  );
};
Captcha.propTypes = {
  callback: PropTypes.func.isRequired,
};

export default Captcha;
