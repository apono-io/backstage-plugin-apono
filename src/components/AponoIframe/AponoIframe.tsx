import React, { useMemo, useRef } from "react";

import { useIframeMessages } from "./useIframeMessages";
import { WarningPanel } from "@backstage/core-components";
import { ProfileInfo } from '@backstage/core-plugin-api';

interface AponoIframeProps {
  clientUrl: URL;
  profile?: ProfileInfo
}

export function AponoIframe({ clientUrl, profile }: AponoIframeProps) {
  const iframeRef = useRef(null);

  const { appIsReady, error } = useIframeMessages(iframeRef, clientUrl, profile);

  const iframeStyles: React.CSSProperties = useMemo(() => ({
    width: '100%',
    height: '100%',
    border: 'none',
    opacity: appIsReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  }), [appIsReady]);

  if (error) {
    let message = 'An error occurred, please contact support.';
    try {
      message = JSON.parse(error.message).message;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse error message', e);
    }

    return (
      <WarningPanel severity="error" title="Internal error" message={message} />
    );
  }

  return (<iframe ref={iframeRef} src={clientUrl.toString()} style={iframeStyles} id="iframe" title="Apono" sandbox="allow-scripts" />)
}
