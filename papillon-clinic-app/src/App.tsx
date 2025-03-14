import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import { ThemeProvider } from './styles/ThemeProvider';
import defaultTheme from './styles/defaultTheme';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthProvider>
        <Router>
          <Routes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
