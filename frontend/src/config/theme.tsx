import { MantineThemeOverride } from '@mantine/core';

const Theme: MantineThemeOverride = {
  colorScheme: 'dark',
  colors: {
    skyblue: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#D5D7E0',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0C8599',
      '#0a7182',
    ],
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#3c4557',
      '#34354a',
      '#1C2536',
      '#1d1e30',
      '#1C2536',
      '#fff',
    ],
  },
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'skyblue',

  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
};

export default Theme;
