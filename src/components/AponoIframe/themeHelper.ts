import { Theme } from '@material-ui/core/styles';

export function getEssentialTheme(theme: Theme) {
  return {
    mode: theme.palette.type,
    primary: theme.palette.primary.main,
    background: theme.palette.background.default,
    text: theme.palette.text.primary,
  };
} 