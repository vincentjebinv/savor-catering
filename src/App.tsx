import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn as checkLoginStatus } from './core/services/SessionService';
import { LanguageProvider } from './core/context/LanguageProvider';
import DisclaimerModal from './shared/components/DisclaimerModal';

// Lazy loading pages for performance
const LandingPage = lazy(() => import('./features/auth/LandingPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const AdminPage = lazy(() => import('./features/menu/AdminPage'));
const MenuPage = lazy(() => import('./features/menu/MenuPage'));
const SelectionPage = lazy(() => import('./features/orders/SelectionPage'));
const HistoryPage = lazy(() => import('./features/orders/HistoryPage'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50">
    <div className="text-lg font-bold text-gray-400 animate-pulse">Loading SaaS Module...</div>
  </div>
);

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

  if (loading) return <PageLoader />;

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          {isLoggedIn && <DisclaimerModal />}
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/selection" element={<SelectionPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/admin" element={<AdminPage />} />
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
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;