import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../core/context/LanguageProvider';
import LanguageToggle from '../../shared/components/LanguageToggle';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 🟢 Points to the image you saved in the public folder
  const APP_LOGO = "/logo.png";

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Logo Section */}
        <div className="mb-8 flex h-56 w-56 items-center justify-center rounded-full bg-white shadow-2xl ring-8 ring-green-50 overflow-hidden border border-gray-100">
          <img 
            src={APP_LOGO}
            alt="Savor Catering" 
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback if the file name is different
              (e.target as HTMLImageElement).src = "https://content.jdmagicbox.com/comp/virudhunagar/d4/9999p4562.4562.240202152309.k1d4/catalogue/ms7jjjssevyer3a-nfs8a8cu0a.jpg";
            }}
          />
        </div>

        <h1 className="mb-3 text-4xl font-black tracking-tight text-gray-900">
          {t('appName')}
        </h1>
        <p className="mb-10 text-gray-500 text-lg font-medium max-w-xs mx-auto leading-relaxed">
          {t('tagline')}
        </p>

        {/* Big Green Button */}
        <button 
          onClick={() => navigate('/menu')} 
          className="group flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-green-600 py-4 text-sm font-bold text-white shadow-xl shadow-green-200 transition-all active:scale-95 hover:bg-green-700"
        >
          {t('viewMenu')}
          <span className="group-hover:translate-x-1 transition-transform text-lg">→</span>
        </button>

        {/* Admin Links */}
        <div className="mt-16 flex items-center gap-6 text-xs font-bold tracking-widest text-gray-400 uppercase">
          <button onClick={() => navigate('/login')} className="hover:text-green-600 transition-colors">
            {t('adminLogin')}
          </button>
          <span className="text-gray-300">•</span>
          <button onClick={() => navigate('/register')} className="hover:text-green-600 transition-colors">
            {t('register')}
          </button>
        </div>
      </div>
    </div>
  );
}