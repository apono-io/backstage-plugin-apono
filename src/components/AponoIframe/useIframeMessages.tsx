import { useApi, ProfileInfo } from '@backstage/core-plugin-api';
import { useCallback, useEffect, useState, RefObject } from 'react';
import { aponoApiRef } from '../../api';
import { isSameOrigin, isValidUrl } from '../helpers';
import {  ThemeOptions, useTheme } from '@material-ui/core';
import { serializeTheme } from './themeSerializer';

const MessageType = {
  READY: 'READY',
  AUTHENTICATE: 'AUTHENTICATE',
  THEME_UPDATE: 'THEME_UPDATE',
  THEME_READY: 'THEME_READY',
} as const;

type IframeMessageType = (typeof MessageType)[keyof typeof MessageType];

interface IframeAuth {
  token: string;
  isFetched: boolean;
  isFetching: boolean;
}

interface IframeMessage {
  type: IframeMessageType;
  message?: string;
  auth?: IframeAuth;
  theme?: ThemeOptions;
}

const useIframeMessageSender = (iframeRef: RefObject<HTMLIFrameElement>, clientUrl: URL) => {
  return useCallback(
    (message: IframeMessage) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(message, clientUrl.origin);
      }
    },
    [clientUrl.origin, iframeRef],
  );
};

const useThemeUpdater = (themeReady: boolean, iframeRef: RefObject<HTMLIFrameElement>, clientUrl: URL) => {
  const theme = useTheme();
  const sendMessage = useIframeMessageSender(iframeRef, clientUrl);

  useEffect(() => {
    if (themeReady && theme) {
      sendMessage({
        type: MessageType.THEME_UPDATE,
        theme: serializeTheme(theme),
      });
    }
  }, [themeReady, theme, sendMessage]);
};

const useAuthenticate = (
  iframeRef: RefObject<HTMLIFrameElement>,
  clientUrl: URL,
  profile?: ProfileInfo,
) => {
  const apiClient = useApi(aponoApiRef);
  const [authState, setAuthState] = useState({
    token: '',
    isFetched: false,
    isFetching: false,
    error: undefined as Error | undefined,
  });
  const sendMessage = useIframeMessageSender(iframeRef, clientUrl);

  const fetchToken = async () => {
    setAuthState(prev => ({ ...prev, isFetching: true }));

    try {
      const res = await apiClient.authenticate(profile?.email);
      setAuthState(prev => ({
        ...prev,
        token: res.token,
        isFetched: true,
        isFetching: false,
      }));
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: err as Error,
        isFetched: true,
        isFetching: false,
      }));
    }
  };

  useEffect(() => {
    const { token, isFetched, isFetching } = authState;
    if (isFetched && token) {
      sendMessage({
        type: MessageType.AUTHENTICATE,
        auth: { token, isFetched, isFetching },
      });
    }
  }, [authState, sendMessage]);

  return { fetchToken, error: authState.error };
};

export function useIframeMessages(
  iframeRef: RefObject<HTMLIFrameElement>,
  clientUrl: URL,
  profile?: ProfileInfo,
) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const { fetchToken, error } = useAuthenticate(iframeRef, clientUrl, profile);

  useThemeUpdater(themeReady, iframeRef, clientUrl);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent<IframeMessage>) => {
      try {
        if (!isValidUrl(event.origin) || !isSameOrigin(new URL(event.origin), clientUrl)) {
          return;
        }

        switch (event.data.type) {
          case MessageType.READY:
            setAppIsReady(true);
            fetchToken();
            break;
          case MessageType.THEME_READY:
            setThemeReady(true);
            break;
          default:
            break;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error handling iframe message:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [clientUrl, fetchToken]);

  return { appIsReady, themeReady, error };
}
