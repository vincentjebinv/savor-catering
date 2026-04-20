import { useTranslation } from "../context/LanguageProvider";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useTranslation();

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-2 py-1 shadow-sm transition-colors"
    >
      <span className="text-xs font-bold text-green-700">
        {language === 'en' ? 'தமிழ்' : 'Eng'}
      </span>
      <div className={`relative h-5 w-9 rounded-full transition-colors ${language === 'ta' ? 'bg-green-500' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform ${language === 'ta' ? 'translate-x-4 left-0.5' : 'left-0.5'}`} />
      </div>
    </button>
  );
}