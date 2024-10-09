import { useApi } from '@backstage/core-plugin-api';
import React, { useCallback, useEffect, useState } from 'react';
import { aponoApiRef } from '../../api';

export const MessageType = {
  READY: 'READY',
  AUTHENTICATE: 'AUTHENTICATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

interface IframeAuth {
  token: string;
  isFetched: boolean;
  isFetching: boolean;
  error?: string;
}

interface IframeMessage {
  type: MessageType;
  message?: string;
  auth?: IframeAuth;
}

function useAuthenticate(iframeRef: React.RefObject<HTMLIFrameElement>, clientUrl: string) {
  const apiClient = useApi(aponoApiRef);

  const clientUrlParsed = new URL(clientUrl);

  const [token, setToken] = useState<string | undefined>();
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const fetchToken = async () => {
    setIsFetching(true);
    apiClient.authenticate()
      .then(t => setToken(t.token))
      .catch(() => setError('Failed to authenticate'))
      .finally(() => {
        setIsFetched(true)
        setIsFetching(false)
      });
  }

  const sendMessage = useCallback((message: IframeMessage) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, clientUrlParsed.origin);
    }
  }, [clientUrlParsed.origin, iframeRef]);

  useEffect(() => {
    if (isFetched && token) {
      sendMessage({ type: MessageType.AUTHENTICATE, auth: {
        isFetched,
        token,
        isFetching,
        error
      }});
    }
  }, [isFetched, token, isFetching, error, sendMessage]);

  return fetchToken
}

export function useIframeMessages(iframeRef: React.RefObject<HTMLIFrameElement>, clientUrl: string) {
  const [appIsReady, setAppIsReady] = useState(false);
  const fetchToken = useAuthenticate(iframeRef, clientUrl);


  useEffect(() => {
    const handleMessage = async (event: MessageEvent<IframeMessage>) => {
    const clientUrlParsed = new URL(clientUrl);
    const originUrlParsed = new URL(event.origin);

      if (originUrlParsed.origin !== clientUrlParsed.origin) {
        return;
      }

      switch (event.data.type) {
        case MessageType.READY:
          setAppIsReady(true);
          fetchToken();
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeRef, clientUrl, fetchToken]);

  return { appIsReady };
}
