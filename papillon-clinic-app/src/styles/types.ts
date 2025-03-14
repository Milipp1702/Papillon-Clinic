export interface IDefaultTheme {
  sizes: {
    small: string;
    medium: string;
    large: string;
  };

  colors: {
    primary: string;
    secondary: string;
    terciary: string;

    lightGreen: string;
    lightYellow: string;
    darkBlue: string;

    hover: {
      primary: string;
      secondary: string;
      terciary: string;
    };

    background: string;

    text: string;
    title: string;

    white: string;
    black: string;

    success: string;
    error: string;

    grey: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
    };
  };
}

export interface ITheme extends IDefaultTheme {}
