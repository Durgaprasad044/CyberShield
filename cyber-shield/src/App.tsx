import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmailScanner from './pages/EmailScanner';
import WebsiteScanner from './pages/WebsiteScanner';
import Contact from './pages/Contact';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a11cb',
    },
    secondary: {
      main: '#2575fc',
    },
  },
  typography: {
    fontFamily: "'Josefin Sans', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/email-scanner" element={<EmailScanner />} />
            <Route path="/website-scanner" element={<WebsiteScanner />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
