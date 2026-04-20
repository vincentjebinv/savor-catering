import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn as checkLoginStatus } from './services/SessionService';
import { LanguageProvider } from './context/LanguageProvider';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import MenuPage from './pages/MenuPage';
import SelectionPage from './pages/SelectionPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    const loggedIn = await checkLoginStatus();
    setIsLoggedIn(loggedIn);
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
    const handleAuthChange = () => checkSession();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-lg font-bold text-gray-500 animate-pulse">Solai Catering</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/selection" element={<SelectionPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/menu" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;