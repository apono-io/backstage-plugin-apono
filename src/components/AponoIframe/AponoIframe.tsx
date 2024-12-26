import React, { useMemo, useRef } from "react";
import { Theme } from '@material-ui/core/styles';
import { useIframeMessages } from "./useIframeMessages";
import { WarningPanel } from "@backstage/core-components";
import { ProfileInfo } from '@backstage/core-plugin-api';
import { getEssentialTheme } from './themeHelper';

interface AponoIframeProps {
  clientUrl: URL;
  profile?: ProfileInfo;
  theme?: Theme;
}

export function AponoIframe({ clientUrl, profile, theme }: AponoIframeProps) {
  const iframeRef = useRef(null);
  const { appIsReady, error } = useIframeMessages(iframeRef, clientUrl, profile);

  const iframeStyles: React.CSSProperties = useMemo(() => ({
    width: '100%',
    height: '100%',
    border: 'none',
    opacity: appIsReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  }), [appIsReady]);

  const iframeUrl = useMemo(() => {
    const url = new URL(clientUrl.toString());
    if (theme) {
      url.searchParams.set('theme', JSON.stringify(getEssentialTheme(theme)));
    }
    return url.toString();
  }, [clientUrl, theme]);

  if (error) {
    let message = 'An error occurred, please contact support.';
    try {
      message = JSON.parse(error.message).message;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse error message', e);
    }
    return <WarningPanel severity="error" title="Internal error" message={message} />;
  }

  return (
    <iframe 
      ref={iframeRef} 
      title="Apono" 
      src={iframeUrl} 
      style={iframeStyles} 
      id="iframe" 
      sandbox="allow-scripts allow-same-origin" 
    />
  );
}
