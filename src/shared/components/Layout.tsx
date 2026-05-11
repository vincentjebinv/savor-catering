import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Clock, Key, LogOut } from 'lucide-react';
import clsx from 'clsx';
import LanguageToggle from './LanguageToggle';
import { logoutUser } from '../../features/auth/AuthService';
import { useTranslation } from '../../core/context/LanguageProvider';
import { useCartStore } from '../../features/orders/cartStore'; // 🟢 Import store

interface LayoutProps {
  children: ReactNode;
  title: string;
  showHeader?: boolean;
  disablePadding?: boolean;
}

export default function Layout({ 
  children, title, showHeader = true, disablePadding = false 
}: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const { t } = useTranslation(); 
  const cartCount = useCartStore(state => {
    const active = state.groups.find(g => g.id === state.activeGroupId);
    return active ? active.items.length : 0;
  });

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logoutUser();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      
      {showHeader && (
        <div className="flex h-16 shrink-0 items-center justify-between bg-white px-4 shadow-sm z-20">
          <h1 className="text-xl font-black text-slate-800">{t(title.toLowerCase())}</h1> {/* 🟢 Use t() */}
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} title="Logout"><LogOut size={20} /></button>
            <LanguageToggle />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className={disablePadding ? "" : "p-4"}>{children}</div>
      </div>

      <div className="flex h-16 w-full shrink-0 items-center border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative z-20">
        <button onClick={() => navigate('/menu')} className={clsx("flex flex-1 flex-col items-center", isActive('/menu') ? "text-green-600" : "text-gray-400")}>
          <Home size={24} /><span className="mt-1 text-[10px] font-bold">{t('menu')}</span>
        </button>
        <button onClick={() => navigate('/selection')} className={clsx("flex flex-1 flex-col items-center relative", isActive('/selection') ? "text-green-600" : "text-gray-400")}>
          <div className="relative">
            <ClipboardList size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[8px] font-bold text-white transition-all scale-110 animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </div>
          <span className="mt-1 text-[10px] font-bold">{t('selection')}</span>
        </button>
        <button onClick={() => navigate('/history')} className={clsx("flex flex-1 flex-col items-center", isActive('/history') ? "text-green-600" : "text-gray-400")}>
          <Clock size={24} /><span className="mt-1 text-[10px] font-bold">{t('history')}</span>
        </button>
        <button onClick={() => navigate('/admin')} className={clsx("flex flex-1 flex-col items-center", isActive('/admin') ? "text-green-600" : "text-gray-400")}>
          <Key size={24} /><span className="mt-1 text-[10px] font-bold">{t('admin')}</span>
        </button>
      </div>
    </div>
  );
}