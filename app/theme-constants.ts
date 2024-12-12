interface ThemeColor {
  main: string;
  light: string;
  dark?: string;
}

interface ThemeBackground {
  main: string;
  paper: string;
}

interface Theme {
  primary: ThemeColor;
  secondary: ThemeColor;
  success: ThemeColor;
  error: ThemeColor;
  warning: ThemeColor;
  background: ThemeBackground;
}

export const theme: Theme = {
  primary: {
    main: '#4F46E5',    // Indigo-600
    light: '#818CF8',   // Indigo-400
    dark: '#3730A3',    // Indigo-800
  },
  secondary: {
    main: '#6B7280',    // Gray-500
    light: '#F3F4F6',   // Gray-100
    dark: '#374151',    // Gray-700
  },
  success: {
    main: '#10B981',    // Emerald-500
    light: '#D1FAE5',   // Emerald-50
    dark: '#065F46',    // Emerald-800
  },
  error: {
    main: '#EF4444',    // Red-500
    light: '#FEE2E2',   // Red-50
    dark: '#B91C1C',    // Red-800
  },
  warning: {
    main: '#F59E0B',    // Amber-500
    light: '#FEF3C7',   // Amber-50
    dark: '#B45309',    // Amber-800
  },
  background: {
    main: '#F9FAFB',    // Gray-50
    paper: '#FFFFFF',   // White
  }
}

// CSS Variables for use in Tailwind config
export const cssVariables = {
  '--color-primary': theme.primary.main,
  '--color-primary-light': theme.primary.light,
  '--color-primary-dark': theme.primary.dark,
  '--color-secondary': theme.secondary.main,
  '--color-secondary-light': theme.secondary.light,
  '--color-secondary-dark': theme.secondary.dark,
  '--color-success': theme.success.main,
  '--color-success-light': theme.success.light,
  '--color-error': theme.error.main,
  '--color-error-light': theme.error.light,
  '--color-warning': theme.warning.main,
  '--color-warning-light': theme.warning.light,
  '--color-background': theme.background.main,
  '--color-paper': theme.background.paper,
} 