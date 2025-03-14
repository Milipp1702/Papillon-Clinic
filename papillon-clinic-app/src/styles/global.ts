import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  :root {
    --text: #575757;
    --font-family: 'Nunito', sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    color: var(--text);
    line-height: 22px;
    font-size: 16px;
    font-family: var(--font-family);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    background-color: ${({ theme }) => theme.colors.background};
    overflow: hidden;

    ::-webkit-scrollbar {
      width: 6px;
    }
 
    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background: #f4f4f4;
    }
 
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #dad7d7;
    }
}

  ul, ol, li {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  .react-modal-overlay {
    background: rgba(75, 75, 75, 0.6);
    bottom: 0;
    overflow: hidden auto;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 200;
  }

  .react-modal-content {
    position: relative;
    width: 100%;
    max-width: 50%;
    padding: 40px;
    margin: 50px auto;
    border-radius: 6px;
    background-color: white;
  }
`;

export default GlobalStyle;
