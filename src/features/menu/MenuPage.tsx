import { useState, useEffect } from 'react';
import Layout from '../../shared/components/Layout';
import { Plus, Search, X, Image as ImageIcon } from 'lucide-react';
import { getMenuData } from './MenuService';
import type { Category, Dish } from './MenuService';
import { useCartStore } from '../orders/cartStore';
import { Capacitor } from '@capacitor/core';
import clsx from 'clsx';
 
import LanguageToggle from '../../shared/components/LanguageToggle';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../core/context/LanguageProvider';

// 🎨 List of colors for the banners (used when no photo exists)
const BANNER_COLORS = [
  'bg-orange-100 text-orange-600',
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-yellow-100 text-yellow-600',
  'bg-indigo-100 text-indigo-600',
];

export default function MenuPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCatId, setActiveCatId] = useState<string>('');
  const [logoPath, setLogoPath] = useState<string | null>(null);
  
  const [viewingDish, setViewingDish] = useState<Dish | null>(null);

  const { addItem } = useCartStore();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching menu data...");
        const data = await getMenuData();
        console.log("Menu data received:", data);
        
        setCategories(data.categories);
        setDishes(data.dishes);
        if (data.categories.length > 0) setActiveCatId(data.categories[0].id);

        setLogoPath(null);
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    load();
  }, []);
  
  const activeDishes = dishes.filter(d => {
    const matchesCategory = d.category_id === activeCatId;
    if (!searchTerm) return matchesCategory;
    const matchesSearch = d.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (d.name_ta && d.name_ta.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  
  const handleAddItem = (dish: Dish, variety?: any) => {
    addItem({
      dishId: dish.id,
      categoryId: dish.category_id,
      name_en: variety ? variety.name_en : dish.name_en,
      name_ta: variety ? variety.name_ta : dish.name_ta,
      varietyName: variety ? variety.name_en : 'Main Dish'
    });
  };


  const getName = (item: any) => {
    if (!item) return '---';
    if (language === 'ta' && item.name_ta) return item.name_ta;
    return item.name_en || 'Unnamed';
  };

  // 🟢 SMART RENDERER: Shows Photo or Color Banner
  const renderDishTop = (dish: Dish, index: number) => {
    if (dish.image_path) {
      const finalSrc = dish.image_path.startsWith('http') ? dish.image_path : Capacitor.convertFileSrc(dish.image_path);
      return (
        <img 
          src={finalSrc} 
          className="h-full w-full object-cover" 
          alt={dish.name_en} 
          loading="lazy"
          decoding="async"
        />
      );
    }

    const colorClass = BANNER_COLORS[index % BANNER_COLORS.length];
    return (
      <div className={clsx("h-full w-full flex items-center justify-center p-4 text-center select-none", colorClass)}>
        <span className="text-lg font-black leading-tight uppercase opacity-80">
          {getName(dish)}
        </span>
      </div>
    );
  };

  return (
    <Layout title="Menu" showHeader={false} disablePadding={true}>
      
      {/* 🟢 CUSTOM HEADER */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        
        {/* Row 1: Brand & Actions */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-50">
          <div className="w-1/4">
              <h1 className="text-xl font-bold text-slate-800">{t('menu')}</h1>
          </div>



          <div className="flex items-center justify-center gap-2 w-2/4">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border border-green-200 flex-shrink-0 shadow-sm">
               {logoPath ? (
                 <img src={Capacitor.convertFileSrc(logoPath)} alt="Logo" className="h-full w-full object-cover" />
               ) : (
                 <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
               )}
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">Savor Catering</span>
          </div>

          <div className="flex items-center justify-end gap-2 w-1/4">
            <LanguageToggle />
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-green-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Row 3: Category Tabs */}
        {!loading && categories.length > 0 && (
          <div className="px-4 py-3 bg-white border-b border-orange-200">
              <div className="flex w-full space-x-2 p-1 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCatId(cat.id)}
                    className={clsx(
                      "rounded-xl py-2 px-5 text-sm font-black whitespace-nowrap transition-all text-center min-w-[120px] shadow-sm border-2",
                      activeCatId === cat.id 
                        ? "bg-green-600 text-white border-green-600 scale-105" 
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300"
                    )}
                  >
                    {getName(cat)}
                  </button>
                ))}
              </div>
          </div>
        )}
      </div>


      {error && (
        <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold">
          <p>⚠️ Error loading menu:</p>
          <p className="font-mono text-xs mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {loading && <div className="text-center py-10 text-gray-400 font-bold animate-pulse">{t('loading')}</div>}

      {/* 🟢 MAIN CONTENT AREA */}
      {!loading && categories.length > 0 && (
        <main className="flex-1 bg-slate-50">
          {/* GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pt-6 pb-24">
            {activeDishes.map((dish, index) => {
              let varieties = [];
              try { varieties = typeof dish.varieties === 'string' ? JSON.parse(dish.varieties) : (dish.varieties || []); } catch (e) { varieties = []; }
              const hasVarieties = Array.isArray(varieties) && varieties.length > 0;
              
              return (
                <div key={dish.id} className="group overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 transition-all active:scale-95 h-fit">
                   <div 
                    onClick={() => { if (hasVarieties) setViewingDish(dish); }} 
                    className={`relative h-40 w-full overflow-hidden ${hasVarieties ? 'cursor-pointer' : ''}`}
                   >
                    {renderDishTop(dish, index)}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddItem(dish); }} 
                      className="absolute bottom-2 right-2 h-10 w-10 flex items-center justify-center rounded-full bg-green-600 text-white shadow-xl z-10 border-2 border-white"
                    >
                      <Plus size={20} />
                    </button>
                   </div>
                   <div className="p-4">
                    <h3 className="font-black text-gray-900 truncate text-sm">{getName(dish)}</h3>
                    <p className="text-[10px] text-gray-400 truncate uppercase mt-0.5 font-bold">
                      {language === 'ta' ? dish.name_en : dish.name_ta}
                    </p>
                    {hasVarieties && <div className="mt-2 text-[9px] font-bold text-green-600 uppercase flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> {varieties.length} {t('varieties')}</div>}
                   </div>
                </div>
              );
            })}
          </div>

          {activeDishes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <p className="text-gray-500 font-bold">{t('noDishesFound')}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase">Active Category ID: {activeCatId}</p>
            </div>
          )}
        </main>
      )}

      {!loading && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 px-10 text-center bg-slate-50 min-h-[calc(100vh-160px)]">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Plus size={40} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('noCategoriesFound')}</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs">{t('startBuildingCatalog')}</p>
          
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
              onClick={async () => {
                setLoading(true);
                const { ...defaults } = await import('./DefaultMenu');
                const { seedMenuData } = await import('./MenuService');
                const seedData = [
                  { nameEn: 'Breakfast', nameTa: 'காலை உணவு', items: defaults.DEFAULT_BREAKFAST, order: 1 },
                  { nameEn: 'Lunch', nameTa: 'மதிய உணவு', items: defaults.DEFAULT_LUNCH, order: 2 },
                  { nameEn: 'Dinner', nameTa: 'இரவு உணவு', items: defaults.DEFAULT_DINNER, order: 3 },
                  { nameEn: 'Sweets', nameTa: 'இனிப்புகள்', items: defaults.DEFAULT_SWEETS, order: 4 },
                  { nameEn: 'Starters', nameTa: 'தொடக்க உணவுகள்', items: defaults.DEFAULT_STARTERS, order: 5 },
                ];
                await seedMenuData(seedData);
                window.location.reload();
              }}
              className="bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100"
            >
              {t('setupDefaultMenu')}
            </button>
            <button onClick={() => navigate('/admin')} className="text-green-600 font-bold text-sm py-2">
              {t('addManualCategory')}
            </button>
          </div>
        </div>
      )}




      {/* 🟢 VARIETY SELECTION MODAL */}
      {viewingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-25">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <div>
                <h3 className="font-black text-xl text-slate-800">{getName(viewingDish)}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('selectVariety')}</p>
              </div>
              <button onClick={() => setViewingDish(null)} className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><X size={18} /></button>
            </div>
            
            <div className="overflow-y-auto p-3 space-y-3 bg-gray-50">
              {(() => {
                let varieties = [];
                try { 
                  varieties = typeof viewingDish.varieties === 'string' 
                    ? JSON.parse(viewingDish.varieties) 
                    : (viewingDish.varieties || []); 
                } catch (e) { varieties = []; }
                
                return varieties.map((v: any, idx: number) => (
                  <div key={idx} className="flex items-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 mr-4 border border-gray-200">
                      {v.image_path ? (
                        <img 
                          src={v.image_path.startsWith('http') ? v.image_path : Capacitor.convertFileSrc(v.image_path)} 
                          className="h-full w-full object-cover" 
                          alt={getName(v)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon size={16} className="text-gray-300"/>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{getName(v)}</p>
                      <p className="text-xs text-gray-500 truncate">{language === 'ta' ? v.name_en : v.name_ta}</p>
                    </div>
                    <button onClick={() => handleAddItem(viewingDish, v)} className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-transform active:scale-90">
                      <Plus size={18} />
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}