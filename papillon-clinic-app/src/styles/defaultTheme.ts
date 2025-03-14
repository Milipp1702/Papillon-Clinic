import { ITheme } from './types';

const defaultTheme: ITheme = {
  sizes: {
    small: '1.2rem',
    medium: '1.6rem',
    large: '2.4rem',
  },

  colors: {
    primary: '#F19CA3',
    secondary: '#C7B7D1',
    terciary: '#63BAC9',

    lightGreen: '#C4EE88',
    lightYellow: '#fffd93',
    darkBlue: '#4f9eac',

    background: '#FFFFFF',

    text: '#575757',
    title: '#242E35',

    white: '#FFFFFF',
    black: '#000000',

    success: '#008732',
    error: '#ea5455',

    hover: {
      primary: '#be787e',
      secondary: '#847091',
      terciary: '#437b85',
    },

    grey: {
      100: '#AAAAAA',
      200: '#575757',
      300: '#E7E7E7',
      400: '#F4F4F4',
      500: '#D6D6D6',
    },
  },
};

export default defaultTheme;
