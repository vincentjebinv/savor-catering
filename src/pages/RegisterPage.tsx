import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ChevronLeft, Loader2 } from 'lucide-react';
import { registerUser } from '../services/AuthService'; // 🟢 Path Fixed
import { useTranslation } from '../context/LanguageProvider';
import clsx from 'clsx'; // 🟢 Import added to fix the "clsx" error

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // UI States
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleRegister = async () => {
    if (isSubmitting) return;
    setError('');

    if (!email || !password || !confirmPass) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // The registerUser service now handles lowercase and auto-restore logic
      const result = await registerUser(email, password, "Solai Catering");

      if (result.success) {
        window.dispatchEvent(new Event('auth-change'));
        navigate('/menu');
      } else {
        setError(result.message || "Registration failed");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      <div className="flex h-16 items-center px-4 shrink-0">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1 text-slate-600 font-bold hover:text-green-600 transition-colors"
        >
          <ChevronLeft size={20} /> {t('back')}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-green-50 p-3 rounded-full mb-3">
              <Lock className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('createAdminAccount')}</h2>
            <p className="text-xs text-gray-400 mt-1">{t('registerToManage')}</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder={t('emailAddress')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500"
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500"
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input
              type={showPass ? "text" : "password"}
              placeholder={t('confirmPassword')}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500"
            />

            {error && <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg text-center">{error}</div>}

            <button 
              onClick={handleRegister}
              disabled={isSubmitting}
              className={clsx(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all",
                isSubmitting ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              )}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : t('register')}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              {t('haveAccount')} {" "}
              <span onClick={() => !isSubmitting && navigate('/login')} className="text-green-600 font-bold cursor-pointer">{t('login')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}