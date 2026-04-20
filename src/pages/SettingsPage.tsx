import { useState, useEffect } from 'react';
import { ChevronLeft, Upload, LogOut, Camera as CameraIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getSessionUserEmail} from '../services/SessionService';
import { logoutUser, updateUserPassword } from '../services/AuthService';
import { getSettings, saveLogoPath } from '../services/SettingsService';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from '../context/LanguageProvider';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoPathToSave, setLogoPathToSave] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSessionUserEmail().then(e => setEmail(e || ''));
    getSettings().then(settings => { 
      if (settings?.logo_path) setLogoSrc(Capacitor.convertFileSrc(settings.logo_path)); 
    });
  }, []);

  const handleUploadLogo = async () => {
    const result = await ActionSheet.showActions({
      title: t('uploadNewLogo'),
      options: [
        { title: 'Take Photo' },
        { title: 'Choose from Gallery' },
        { title: 'Cancel', style: ActionSheetButtonStyle.Cancel },
      ],
    });
    if (result.index === 2) return;
    const source = result.index === 0 ? CameraSource.Camera : CameraSource.Photos;
    try {
      const image = await Camera.getPhoto({ quality: 90, allowEditing: false, resultType: CameraResultType.Base64, source: source });
      if (image.base64String) {
        const fileName = `logo_${new Date().getTime()}.jpeg`;
        const savedFile = await Filesystem.writeFile({ path: fileName, data: image.base64String, directory: Directory.Data });
        setLogoPathToSave(savedFile.uri);
        setLogoSrc(`data:image/jpeg;base64,${image.base64String}`);
      }
    } catch (error) {}
  };

  const handleSaveChanges = async () => {
    if (newPassword && newPassword !== confirmPassword) { alert("Passwords do not match."); return; }
    setLoading(true);
    try {
      if (logoPathToSave) await saveLogoPath(logoPathToSave);
      if (newPassword) await updateUserPassword(newPassword);
      
      // 🟢 BACKUP REMOVED FROM HERE
      alert("Settings saved!");
      window.location.reload();
    } catch (e) {
      alert("Error saving settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { 
    if (confirm(t('confirmLogout'))) { await logoutUser(); window.location.href = "/"; } 
  };

  return (
    <Layout title="Settings">
      <div className="mx-auto max-w-lg pb-20">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-gray-500 font-bold">
          <ChevronLeft size={16} /> {t('back')}
        </button>
        
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
          <div className="mb-8 text-center border-b pb-6">
            <h3 className="mb-4 text-left font-bold text-gray-900">{t('companyLogo')}</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="h-28 w-28 rounded-full bg-slate-50 ring-4 ring-slate-100 overflow-hidden flex items-center justify-center shadow-inner relative">
                {logoSrc ? <img src={logoSrc} className="h-full w-full object-cover" /> : <CameraIcon size={40} className="text-gray-300" />}
              </div>
              <button onClick={handleUploadLogo} className="flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2 text-xs font-bold text-white shadow hover:bg-slate-700 active:scale-95 transition-all">
                <Upload size={14} /> {t('uploadNewLogo')}
              </button>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-500">{t('emailAddress')}</label>
              <input type="text" value={email} readOnly className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500 outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-500">{t('newPassword')}</label>
              <input type="password" placeholder={t('newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 transition-all" />
            </div>
            {newPassword && (
              <input type="password" placeholder={t('confirmNewPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 animate-in fade-in slide-in-from-top-1" />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50">
              <LogOut size={18} /> {t('logout')}
            </button>
            <button onClick={handleSaveChanges} disabled={loading} className="rounded-xl bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 disabled:opacity-50">
              {loading ? t('loading') : t('saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}