import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { loginUser } from '../services/AuthService';
import { useTranslation } from '../context/LanguageProvider';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🟢 Points to the image you saved in the public folder
  const APP_LOGO = "/logo.jpg";

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    const result = await loginUser(email, password);
    if (result.success) {
      window.dispatchEvent(new Event('auth-change'));
      navigate('/menu');
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      <div className="flex h-16 items-center px-4 shrink-0">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-slate-600 font-bold">
          <ChevronLeft size={20} /> {t('back')}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          
          <div className="mb-6 flex flex-col items-center">
            <img src={APP_LOGO} className="h-20 w-20 rounded-full object-cover mb-3 shadow-md border-2 border-green-100" />
            <h2 className="text-xl font-bold text-gray-900">{t('adminAccess')}</h2>
            <p className="text-xs text-gray-400 mt-1">{t('signInContinue')}</p>
          </div>

          <div className="space-y-4">
            <input 
              type="email" 
              placeholder={t('emailAddress')} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500" 
            />
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                placeholder={t('password')} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500" 
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-center text-xs text-red-500 font-bold">{error}</p>}
            <button onClick={handleLogin} className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-100">
              {t('login')}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              {t('noAccount')} <span onClick={() => navigate('/register')} className="text-green-600 font-bold cursor-pointer">{t('registerNow')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}