import { useApi, ProfileInfo } from '@backstage/core-plugin-api';
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
}

interface IframeMessage {
  type: MessageType;
  message?: string;
  auth?: IframeAuth;
}

function useAuthenticate(
  iframeRef: React.RefObject<HTMLIFrameElement>,
  clientUrl: string,
  profile?: ProfileInfo,
) {
  const apiClient = useApi(aponoApiRef);

  const clientUrlParsed = new URL(clientUrl);

  const [token, setToken] = useState<string | undefined>();
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchToken = async () => {
    setIsFetching(true);

    try {
      const res = await apiClient.authenticate(profile?.email);
      setToken(res.token);
    } catch (err) {
      setError(err as Error)
    }

    setIsFetched(true)
    setIsFetching(false)
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
      }});
    }
  }, [isFetched, token, isFetching, error, sendMessage]);

  return { fetchToken, error }
}

export function useIframeMessages(
  iframeRef: React.RefObject<HTMLIFrameElement>,
  clientUrl: string,
  profile?: ProfileInfo,
) {
  const [appIsReady, setAppIsReady] = useState(false);
  const { fetchToken, error } = useAuthenticate(iframeRef, clientUrl, profile);

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

  return { appIsReady, error };
}
