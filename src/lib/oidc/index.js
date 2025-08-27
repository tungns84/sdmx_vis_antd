import { createContext, useContext } from 'react';

const OidcContext = createContext();

export const OidcProvider = OidcContext.Provider;
export const useOidc = () => useContext(OidcContext);

export const userSignIn = (auth) => {
  if (!auth) return;

  const url = auth.authorizationUrl;
  window.open(
    url,
    '_blank',
    `toolbar = no,
      location = no,
      directories = no,
      status = no,
      menubar = no,
      copyhistory = no,
      width = 700, height = 700, top = 100, left = 100`,
  );
};
