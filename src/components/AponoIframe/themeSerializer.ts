import { Theme, ThemeOptions } from '@material-ui/core';

export const serializeTheme = (theme: Theme): ThemeOptions => ({
  palette: {
    type: theme.palette.type,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    warning: theme.palette.warning,
    info: theme.palette.info,
    success: theme.palette.success,
    text: theme.palette.text,
    background: theme.palette.background,
    divider: theme.palette.divider,
    action: theme.palette.action,
    common: theme.palette.common,
    tonalOffset: theme.palette.tonalOffset,
    contrastThreshold: theme.palette.contrastThreshold,
    grey: theme.palette.grey,
    border: theme.palette.border,
  },
  typography: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeightLight: theme.typography.fontWeightLight,
    fontWeightRegular: theme.typography.fontWeightRegular,
    fontWeightMedium: theme.typography.fontWeightMedium,
    fontWeightBold: theme.typography.fontWeightBold,
    h1: theme.typography.h1,
    h2: theme.typography.h2,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle1: theme.typography.subtitle1,
    subtitle2: theme.typography.subtitle2,
    body1: theme.typography.body1,
    body2: theme.typography.body2,
    button: theme.typography.button,
    caption: theme.typography.caption,
    overline: theme.typography.overline,
  },
  shape: {
    borderRadius: theme.shape.borderRadius,
  },
  breakpoints: {
    values: {
      xs: theme.breakpoints.values.xs,
      sm: theme.breakpoints.values.sm,
      md: theme.breakpoints.values.md,
      lg: theme.breakpoints.values.lg,
      xl: theme.breakpoints.values.xl,
    },
  },
  shadows: theme.shadows,
  overrides: theme.overrides,
  props: theme.props,
}); 