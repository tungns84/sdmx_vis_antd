import React from 'react';
import * as R from 'ramda';
import { sanitizeOptions } from '../lib/settings';

// Lazy load sanitize-html to handle CommonJS module
let sanitizeHtmlLib = null;
const getSanitizeHtml = async () => {
  if (!sanitizeHtmlLib) {
    const module = await import('sanitize-html');
    sanitizeHtmlLib = module.default || module;
  }
  return sanitizeHtmlLib;
};

const SanitizedInnerHTML = ({ html = '', ...rest }) => {
  const [sanitizedHtml, setSanitizedHtml] = React.useState('');
  
  React.useEffect(() => {
    if (!R.is(String, html)) {
      setSanitizedHtml(html);
      return;
    }
    
    getSanitizeHtml().then(sanitizeHtml => {
      const cleaned = typeof sanitizeHtml === 'function' 
        ? sanitizeHtml(html, sanitizeOptions)
        : sanitizeHtml.default 
          ? sanitizeHtml.default(html, sanitizeOptions)
          : sanitizeHtml(html, sanitizeOptions);
      setSanitizedHtml(cleaned);
    });
  }, [html]);

  if (!R.is(String, html)) {
    return html;
  }
  
  return (
    <span
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      {...rest}
    />
  );
};

export default SanitizedInnerHTML;
