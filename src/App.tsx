import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider }  from './context/ThemeContext';
import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/ProtectedRoute';
import LoginPage          from './pages/LoginPage';
import DashboardPage      from './pages/DashboardPage';

const App: React.FC = () => (
  /* ThemeProvider must be outermost so every component can read isDark */
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"               element={<Navigate to="/login" replace />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/:role" element={<DashboardPage />} />
          </Route>
          <Route path="*"               element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;