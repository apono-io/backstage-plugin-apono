import { useApi, ProfileInfo } from '@backstage/core-plugin-api';
import { useCallback, useEffect, useState, RefObject } from 'react';
import { aponoApiRef } from '../../api';
import { isSameOrigin, isValidUrl } from '../helpers';
import { ThemeOptions, useTheme } from '@material-ui/core';
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

const useIframeMessageSender = (iframeRef: RefObject<HTMLIFrameElement | null>, clientUrl: URL) => {
  return useCallback(
    (message: IframeMessage) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(message, clientUrl.origin);
      }
    },
    [clientUrl.origin, iframeRef],
  );
};

const useThemeUpdater = (iframeRef: RefObject<HTMLIFrameElement | null>, clientUrl: URL) => {
  const theme = useTheme();
  const sendMessage = useIframeMessageSender(iframeRef, clientUrl);

  const updateTheme = useCallback(() => {
    if (!theme) return;

    sendMessage({
      type: MessageType.THEME_UPDATE,
      theme: serializeTheme(theme),
    });
  }, [theme, sendMessage]);

  return { updateTheme };
};

const useAuthenticate = (
  iframeRef: RefObject<HTMLIFrameElement | null>,
  clientUrl: URL,
  profile?: ProfileInfo,
) => {
  const apiClient = useApi(aponoApiRef);
  const [error, setError] = useState<Error | undefined>();
  const sendMessage = useIframeMessageSender(iframeRef, clientUrl);

  const fetchToken = useCallback(async () => {
    if (!profile?.email) return;

    let token: string | undefined;

    try {
      const res = await apiClient.authenticate(profile?.email);
      token = res.token;
    } catch (err) {
      setError(err as Error)
    }

    if (token) {
      sendMessage({
        type: MessageType.AUTHENTICATE,
        auth: {
          token,
          isFetched: true,
          isFetching: false,
        },
      });
    }
  }, [apiClient, profile?.email, sendMessage]);

  return { fetchToken, error };
};

export function useIframeMessages(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  clientUrl: URL,
  profile?: ProfileInfo,
) {
  const [appIsReady, setAppIsReady] = useState(false);
  const { fetchToken, error } = useAuthenticate(iframeRef, clientUrl, profile);
  const { updateTheme } = useThemeUpdater(iframeRef, clientUrl);

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
            updateTheme();
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
  }, [clientUrl, fetchToken, updateTheme]);

  return { appIsReady, error };
}
