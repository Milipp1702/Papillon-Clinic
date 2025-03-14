import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ReactNode } from 'react';
import { ITheme } from './types';
import GlobalStyle from './global';
import defaultTheme from './defaultTheme';

export interface Props {
  theme?: ITheme;
  children?: ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  return (
    <StyledThemeProvider theme={{ ...defaultTheme }}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
};
