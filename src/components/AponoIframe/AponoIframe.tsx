import React, { useMemo, useRef } from "react";

import { useIframeMessages } from "./useIframeMessages";

interface AponoIframeProps {
  clientUrl: string;
}

export function AponoIframe({ clientUrl }: AponoIframeProps) {
  const iframeRef = useRef(null);

  const { appIsReady } = useIframeMessages(iframeRef, clientUrl);

  const iframeStyles: React.CSSProperties = useMemo(() => ({
    width: '100%',
    height: '100%',
    border: 'none',
    opacity: appIsReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  }), [appIsReady]);

  return (<iframe ref={iframeRef} src={clientUrl} style={iframeStyles} id="iframe" title="Apono" />)
}
