import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Trash2, GripVertical, X, Plus, Image as ImageIcon, Upload, Pencil } from 'lucide-react';
import { 
  getMenuData, addCategory, updateCategory, deleteCategory, 
  addDish, updateDish, deleteDish, updateDishOrder 
} from '../services/MenuService';
import type { Category, Dish } from '../services/MenuService';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from '../context/LanguageProvider';
import { toTamil, toEnglish } from '../utils/OfflineTranslator';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { getLibraryImage } from '../utils/dishLibrary';

// Drag & Drop
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DishVariety { name_en: string; name_ta: string; image_path: string | null; image_src: string | null; }

function SortableDishRow({ dish, language, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dish.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1, opacity: isDragging ? 0.8 : 1, position: 'relative' as 'relative', touchAction: 'none' };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm mb-3">
      <div {...attributes} {...listeners} className="cursor-grab p-2 text-gray-300 hover:text-gray-600"><GripVertical size={20} /></div>
      <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
        {dish.image_path ? (
          <img src={Capacitor.convertFileSrc(dish.image_path)} className="h-full w-full object-cover" alt="" />
        ) : getLibraryImage(dish.name_en, dish.name_ta) ? (
          <img src={getLibraryImage(dish.name_en, dish.name_ta)!} className="h-full w-full object-cover opacity-60" alt="" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ImageIcon size={20} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-800">{language === 'ta' && dish.name_ta ? dish.name_ta : dish.name_en}</h4>
        <p className="text-xs text-gray-500">{language === 'ta' ? dish.name_en : dish.name_ta}</p>
      </div>
      <div className="flex gap-2"><button onClick={() => onEdit(dish)} className="rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">Edit</button><button onClick={() => onDelete(dish.id)} className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">Remove</button></div>
    </div>
  );
}

export default function AdminPage() {
  const { t, language } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingDishId, setEditingDishId] = useState<number | null>(null);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [catEn, setCatEn] = useState('');
  const [catTa, setCatTa] = useState('');
  const [catOrder, setCatOrder] = useState('5');
  const [dishEn, setDishEn] = useState('');
  const [dishTa, setDishTa] = useState('');
  const [dishImageSrc, setDishImageSrc] = useState<string | null>(null);
  const [dishImagePath, setDishImagePath] = useState<string | null>(null);
  const [hasVarieties, setHasVarieties] = useState(false);
  const [varieties, setVarieties] = useState<DishVariety[]>([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const loadData = async () => { setLoading(true); const data = await getMenuData(); setCategories(data.categories); setDishes(data.dishes); setLoading(false); };
  useEffect(() => { loadData(); }, []);

  const handleEnChange = (text: string, type: 'cat' | 'dish' | 'variety', index = -1) => {
    const translated = toTamil(text);
    if (type === 'cat') { setCatEn(text); if(translated !== text) setCatTa(translated); }
    if (type === 'dish') { setDishEn(text); if(translated !== text) setDishTa(translated); }
    if (type === 'variety' && index >= 0) { const updated = [...varieties]; updated[index].name_en = text; if(translated !== text) updated[index].name_ta = translated; setVarieties(updated); }
  };

  const handleTaChange = (text: string, type: 'cat' | 'dish' | 'variety', index = -1) => {
    const translated = toEnglish(text);
    if (type === 'cat') { setCatTa(text); if(!catEn) setCatEn(translated); }
    if (type === 'dish') { setDishTa(text); if(!dishEn) setDishEn(translated); }
    if (type === 'variety' && index >= 0) { const updated = [...varieties]; updated[index].name_ta = text; if(!updated[index].name_en) updated[index].name_en = translated; setVarieties(updated); }
  };

  const handleImagePick = async (varietyIndex = -1) => {
    const result = await ActionSheet.showActions({ title: t('uploadImage'), options: [{ title: 'Take Photo' }, { title: 'Choose from Gallery' }, { title: 'Cancel', style: ActionSheetButtonStyle.Cancel }] });
    if (result.index === 2) return;
    const source = result.index === 0 ? CameraSource.Camera : CameraSource.Photos;
    try {
      const image = await Camera.getPhoto({ quality: 80, resultType: CameraResultType.Base64, source: source });
      if (image.base64String) {
        const fileName = `img_${new Date().getTime()}.jpeg`;
        const savedFile = await Filesystem.writeFile({ path: fileName, data: image.base64String, directory: Directory.Data });
        const displaySrc = `data:image/jpeg;base64,${image.base64String}`;
        if (varietyIndex === -1) { setDishImagePath(savedFile.uri); setDishImageSrc(displaySrc); } 
        else { const updated = [...varieties]; updated[varietyIndex].image_path = savedFile.uri; updated[varietyIndex].image_src = displaySrc; setVarieties(updated); }
      }
    } catch (error) {}
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDishes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        const categoryId = items[oldIndex].category_id;
        const categoryItems = newOrder.filter(i => i.category_id === categoryId);
        categoryItems.forEach((item, idx) => { item.display_order = idx + 1; });
        updateDishOrder(categoryItems);
        return newOrder;
      });
    }
  };

  const getName = (item: any) => language === 'ta' && item.name_ta ? item.name_ta : item.name_en;
  const openCatModal = (cat?: Category) => { if (cat) { setEditingCatId(cat.id); setCatEn(cat.name_en); setCatTa(cat.name_ta); setCatOrder(cat.display_order.toString()); } else { setEditingCatId(null); setCatEn(''); setCatTa(''); setCatOrder('5'); } setShowCatModal(true); };
  const handleSaveCategory = async () => { if (!catEn || !catTa) return; const success = editingCatId ? await updateCategory(editingCatId, catEn, catTa, parseInt(catOrder) || 5) : await addCategory(catEn, catTa, parseInt(catOrder) || 5); if (success) { setShowCatModal(false); loadData(); } };
  const openDishModal = (catId?: number, dish?: Dish) => { if (dish) { setEditingDishId(dish.id); setActiveCatId(dish.category_id); setDishEn(dish.name_en); setDishTa(dish.name_ta); if (dish.image_path) { setDishImagePath(dish.image_path); setDishImageSrc(dish.image_path.startsWith('http') ? dish.image_path : Capacitor.convertFileSrc(dish.image_path)); } else { setDishImagePath(null); setDishImageSrc(null); } if (dish.varieties) { try { const parsed = JSON.parse(dish.varieties); const varietiesWithSrc = parsed.map((v: any) => ({ ...v, image_src: v.image_path ? (v.image_path.startsWith('http') ? v.image_path : Capacitor.convertFileSrc(v.image_path)) : null })); setVarieties(varietiesWithSrc); setHasVarieties(varietiesWithSrc.length > 0); } catch (e) { setVarieties([]); setHasVarieties(false); } } else { setVarieties([]); setHasVarieties(false); } } else { setEditingDishId(null); setActiveCatId(catId || null); setDishEn(''); setDishTa(''); setDishImageSrc(null); setDishImagePath(null); setVarieties([]); setHasVarieties(false); } setShowDishModal(true); };
  const handleSaveDish = async () => { if (!activeCatId || !dishEn || !dishTa) return; const varietiesToSave = varieties.map(v => ({ name_en: v.name_en, name_ta: v.name_ta, image_path: v.image_path })); const success = editingDishId ? await updateDish(editingDishId, activeCatId, dishEn, dishTa, 0, dishImagePath, hasVarieties ? varietiesToSave : []) : await addDish(activeCatId, dishEn, dishTa, 0, dishImagePath, hasVarieties ? varietiesToSave : []); if (success) { setShowDishModal(false); loadData(); } else { alert("Failed to save dish."); } };
  const handleDeleteCategory = async (id: number) => { if (confirm(t('confirmDeleteOrder'))) { await deleteCategory(id); loadData(); } };
  const handleDeleteDish = async (id: number) => { if (confirm(t('confirmDeleteOrder'))) { await deleteDish(id); loadData(); } };
  const addVariety = () => { setVarieties([...varieties, { name_en: '', name_ta: '', image_path: null, image_src: null }]); };
  const removeVariety = (index: number) => { setVarieties(varieties.filter((_, i) => i !== index)); };

  return (
    <Layout title="Admin">
      <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-bold">{t('manageDishes')}</h2><button onClick={() => openCatModal()} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white"><Plus size={16} /> {t('addNewCategory')}</button></div>
      {loading && <p className="py-10 text-center">{t('loading')}</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {!loading && <div className="space-y-8 pb-20">{categories.map((cat) => { const catDishes = dishes.filter(d => d.category_id === cat.id); return (<div key={cat.id}><div className="mb-3 flex items-center justify-between border-b pb-2"><div className="flex items-center gap-2"><div><h3 className="font-bold text-green-700">{getName(cat)}</h3><p className="text-xs text-gray-500">{language === 'ta' ? cat.name_en : cat.name_ta}</p></div><button onClick={() => openCatModal(cat)}><Pencil size={14} /></button></div><div className="flex gap-2"><button onClick={() => openDishModal(cat.id)} className="rounded bg-green-500 px-3 py-1 text-xs font-bold text-white">{t('addDish')}</button><button onClick={() => handleDeleteCategory(cat.id)} className="rounded bg-red-50 p-2 text-red-600"><Trash2 size={14} /></button></div></div><SortableContext items={catDishes} strategy={verticalListSortingStrategy}><div className="space-y-3">{catDishes.map((dish) => (<SortableDishRow key={dish.id} dish={dish} language={language} onEdit={(d: Dish) => openDishModal(cat.id, d)} onDelete={handleDeleteDish} />))}</div></SortableContext></div>); })}</div>}
      </DndContext>
      {showCatModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"><h3 className="mb-6 font-bold">{editingCatId ? t('editCategory') : t('addNewCategory')}</h3><div className="space-y-5"><input type="text" placeholder={t('nameEn')} value={catEn} onChange={e => handleEnChange(e.target.value, 'cat')} className="w-full rounded-lg border px-4 py-2.5 text-sm" /><input type="text" placeholder={t('nameTa')} value={catTa} onChange={e => handleTaChange(e.target.value, 'cat')} className="w-full rounded-lg border px-4 py-2.5 text-sm" /><input type="number" placeholder={t('displayOrder')} value={catOrder} onChange={e => setCatOrder(e.target.value)} className="w-full rounded-lg border px-4 py-2.5 text-sm" /><div className="flex justify-end gap-3 pt-4"><button onClick={() => setShowCatModal(false)} className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-bold">{t('cancel')}</button><button onClick={handleSaveCategory} className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white">{editingCatId ? t('update') : t('add')}</button></div></div></div></div>}
      {showDishModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"><div className="w-full max-w-5xl rounded-xl bg-white p-8 shadow-2xl my-auto"><div className="mb-8 border-b pb-4"><h3 className="font-bold">{editingDishId ? t('editDish') : t('addDish')}</h3></div><div className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div><label className="mb-2 block font-bold">{t('nameEn')}</label><input type="text" value={dishEn} onChange={e => handleEnChange(e.target.value, 'dish')} className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm" /></div><div><label className="mb-2 block font-bold">{t('nameTa')}</label><input type="text" value={dishTa} onChange={e => handleTaChange(e.target.value, 'dish')} className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm" /></div></div><div>
  <label className="mb-2 block font-bold">{t('mainDishImage')}</label>
  <div className="flex items-start gap-6">
    <div className="h-32 w-32 rounded-xl bg-gray-100 border-2 border-dashed overflow-hidden flex items-center justify-center relative">
      {dishImageSrc ? (
        <img src={dishImageSrc} alt="Preview" className="h-full w-full object-cover" />
      ) : getLibraryImage(dishEn, dishTa) ? (
        <div className="relative h-full w-full">
          <img src={getLibraryImage(dishEn, dishTa)!} alt="Library Suggestion" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase truncate">Auto-Suggested</span>
          </div>
        </div>
      ) : (
        <ImageIcon size={32} />
      )}
      {dishImageSrc && (
        <button onClick={() => { setDishImageSrc(null); setDishImagePath(null); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md">
          <X size={12} />
        </button>
      )}
    </div>
    <div className="flex flex-col gap-2 pt-2">
      <button onClick={() => handleImagePick(-1)} className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-bold text-white">
        <Upload size={14} /> {dishImageSrc ? t('changeImage') : t('uploadImage')}
      </button>
      <p className="text-[10px] text-gray-400 max-w-[150px]">
        {dishImageSrc ? 'Using manual upload' : (getLibraryImage(dishEn, dishTa) ? 'Matching from library' : 'No image found')}
      </p>
    </div>
  </div>
</div>
<div><label className="mb-2 block font-bold">Category</label><select value={activeCatId || ''} onChange={e => setActiveCatId(parseInt(e.target.value))} className="w-full rounded-lg border bg-white px-4 py-3 text-sm">{categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}</select></div><div className="flex items-center gap-3 border-t border-b py-6"><button onClick={() => setHasVarieties(!hasVarieties)} className={`h-6 w-11 rounded-full p-1 ${hasVarieties ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${hasVarieties ? 'translate-x-5' : 'translate-x-0'}`} /></button><span>{t('hasVarieties')}</span></div>{hasVarieties && <div className="bg-gray-50 rounded-xl p-4 space-y-4"><div className="flex justify-between items-center"><h4 className="font-bold">{t('dishVarieties')}</h4><button onClick={addVariety} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">+ {t('addVariety')}</button></div>{varieties.map((item, idx) => (<div key={idx} className="bg-white p-4 rounded-lg shadow-sm border"><div className="grid grid-cols-2 gap-4 mb-4"><input type="text" placeholder={t('nameEn')} value={item.name_en} onChange={(e) => handleEnChange(e.target.value, 'variety', idx)} className="w-full border-b pb-2 text-sm" /><input type="text" placeholder={t('nameTa')} value={item.name_ta} onChange={(e) => handleTaChange(e.target.value, 'variety', idx)} className="w-full border-b pb-2 text-sm text-right" /></div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded bg-orange-100 flex items-center justify-center overflow-hidden border">{item.image_src ? <img src={item.image_src} className="h-full w-full object-cover" alt="" /> : <ImageIcon size={16} />}</div><button onClick={() => handleImagePick(idx)} className="px-3 py-1 border rounded text-xs font-bold">{t('change')}</button></div><div className="flex items-center gap-2"><button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-xs font-bold">{t('ingredients')}</button><button onClick={() => removeVariety(idx)} className="h-7 w-7 flex items-center justify-center bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button></div></div></div>))}</div>}<div className="flex justify-end gap-4 pt-4 border-t"><button onClick={() => setShowDishModal(false)} className="rounded-lg bg-gray-200 px-8 py-3 text-sm font-bold">{t('cancel')}</button><button onClick={handleSaveDish} className="rounded-lg bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg">{editingDishId ? t('updateDish') : t('addDish')}</button></div></div></div></div>}
    </Layout>
  );
}