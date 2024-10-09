import React, { useEffect, useRef, useState } from "react";

import styles from './AponoIframe.module.css';
import { useIframeMessages } from "./useIframeMessages";

interface AponoIframeProps {
  clientUrl: string;
}

export function AponoIframe({ clientUrl }: AponoIframeProps) {
  const iframeRef = useRef(null);
  const [classNames, setClassNames] = useState<string[]>([styles.aponoIframe]);

  const { appIsReady } = useIframeMessages(iframeRef, clientUrl);

  useEffect(() => {
    if (appIsReady) {
      setClassNames(prev => [...prev, styles.aponoIframeVisible]);
    }
  }, [appIsReady]);

  return <iframe ref={iframeRef} src={clientUrl} className={classNames.join(' ')} id="iframe" title="Apono" />
}
