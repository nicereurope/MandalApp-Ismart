import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ScreenHome from './screens/Home';
import ScreenColoring from './screens/Coloring';
import ScreenCompletion from './screens/Completion';
import ScreenSettings from './screens/Settings';
import ScreenAuth from './screens/Auth';
import ScreenAdmin from './screens/Admin';
import ScreenGallery from './screens/Gallery';
import './src/styles/minimal.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<ScreenHome />} />
            <Route path="/auth" element={<ScreenAuth />} />
            <Route path="/coloring" element={<ScreenColoring />} />
            <Route path="/completion" element={<ScreenCompletion />} />
            <Route path="/settings" element={<ScreenSettings />} />
            <Route path="/admin" element={<ScreenAdmin />} />
            <Route path="/gallery" element={<ScreenGallery />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;