import { useTheme, Theme } from '@material-ui/core/styles';
import { useCallback, useEffect } from 'react';
import { IframeMessage, MessageType } from './useIframeMessages';

const serializeTheme = (theme: Theme) => ({
  palette: {
    type: theme.palette.type,
    primary: {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      dark: theme.palette.primary.dark,
    },
    secondary: {
      main: theme.palette.secondary.main,
      light: theme.palette.secondary.light,
      dark: theme.palette.secondary.dark,
    },
    error: {
      main: theme.palette.error.main,
      light: theme.palette.error.light,
      dark: theme.palette.error.dark,
    },
    background: {
      default: theme.palette.background.default,
      paper: theme.palette.background.paper,
    },
    text: {
      primary: theme.palette.text.primary,
      secondary: theme.palette.text.secondary,
    },
  },
  typography: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
  },
  shape: {
    borderRadius: theme.shape.borderRadius,
  },
  breakpoints: {
    values: theme.breakpoints.values,
  },
  zIndex: theme.zIndex,
});

export const useThemeUpdater = (appIsReady: boolean, iframeRef: React.RefObject<HTMLIFrameElement>, clientUrl: URL) => {
  const theme = useTheme();

  const sendMessage = useCallback((message: IframeMessage) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, clientUrl.origin);
    }
  }, [clientUrl.origin, iframeRef]);

  useEffect(() => {
    if (appIsReady && theme) {
      sendMessage({
        type: MessageType.THEME_UPDATE,
        theme: serializeTheme(theme)
      });
    }
  }, [appIsReady, theme, sendMessage]);
}
