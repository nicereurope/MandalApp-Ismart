import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ScreenHome from './screens/Home';
import ScreenColoring from './screens/Coloring';
import ScreenCompletion from './screens/Completion';
import ScreenSettings from './screens/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ScreenHome />} />
          <Route path="/coloring" element={<ScreenColoring />} />
          <Route path="/completion" element={<ScreenCompletion />} />
          <Route path="/settings" element={<ScreenSettings />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;