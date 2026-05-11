import React from 'react';
import { useTranslation } from '../../core/context/LanguageProvider';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ 
  isOpen, onClose, onSave, initialData 
}) => {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData || { nameEn: '', nameTa: '', displayOrder: 5 });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h3 className="mb-6 font-bold">{initialData ? t('editCategory') : t('addNewCategory')}</h3>
        <div className="space-y-5">
          <input 
            type="text" 
            placeholder={t('nameEn')} 
            value={data.nameEn} 
            onChange={e => setData({ ...data, nameEn: e.target.value })}
            className="w-full rounded-lg border px-4 py-2.5 text-sm" 
          />
          <input 
            type="text" 
            placeholder={t('nameTa')} 
            value={data.nameTa} 
            onChange={e => setData({ ...data, nameTa: e.target.value })}
            className="w-full rounded-lg border px-4 py-2.5 text-sm" 
          />
          <input 
            type="number" 
            placeholder={t('displayOrder')} 
            value={data.displayOrder} 
            onChange={e => setData({ ...data, displayOrder: parseInt(e.target.value) })}
            className="w-full rounded-lg border px-4 py-2.5 text-sm" 
          />
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-bold">
              {t('cancel')}
            </button>
            <button 
              onClick={() => onSave(data)} 
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white"
            >
              {initialData ? t('update') : t('add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
