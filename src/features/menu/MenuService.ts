import { DEFAULT_BREAKFAST, DEFAULT_LUNCH, DEFAULT_DINNER, DEFAULT_STARTERS, DEFAULT_SWEETS } from './DefaultMenu';

export interface Category {
  id: string;
  name_en: string;
  name_ta: string;
  display_order: number;
  dishes?: Dish[];
}

export interface Dish {
  id: string;
  category_id: string;
  name_en: string;
  name_ta: string;
  price: number;
  image_path?: string | null;
  varieties?: any;
  display_order: number;
}

const getLocalData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setLocalData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initDemoData = () => {
  if (!getLocalData('categories') || !getLocalData('dishes')) {
    const categories: Category[] = [];
    const dishes: Dish[] = [];
    
    const defaultData = [
      { nameEn: 'Breakfast', nameTa: 'காலை உணவு', order: 0, items: DEFAULT_BREAKFAST },
      { nameEn: 'Lunch', nameTa: 'மதிய உணவு', order: 1, items: DEFAULT_LUNCH },
      { nameEn: 'Dinner', nameTa: 'இரவு உணவு', order: 2, items: DEFAULT_DINNER },
      { nameEn: 'Starters', nameTa: 'ஸ்டார்ட்டர்ஸ்', order: 3, items: DEFAULT_STARTERS },
      { nameEn: 'Sweets', nameTa: 'இனிப்புகள்', order: 4, items: DEFAULT_SWEETS },
    ];

    defaultData.forEach((cat, catIndex) => {
      const catId = `cat_${catIndex}`;
      categories.push({
        id: catId,
        name_en: cat.nameEn,
        name_ta: cat.nameTa,
        display_order: cat.order
      });
      
      cat.items?.forEach((dish, dishIndex) => {
        dishes.push({
          id: `dish_${catIndex}_${dishIndex}`,
          category_id: catId,
          name_en: dish.en,
          name_ta: dish.ta,
          price: 0,
          varieties: JSON.stringify((dish as any).varieties || []),
          display_order: dishIndex
        });
      });
    });
    
    setLocalData('categories', categories);
    setLocalData('dishes', dishes);
  }
};

export const MenuService = {
  getMenu: async (): Promise<Category[]> => {
    initDemoData();
    const categories: Category[] = getLocalData('categories') || [];
    const allDishes: Dish[] = getLocalData('dishes') || [];
    
    return categories
      .sort((a, b) => a.display_order - b.display_order)
      .map(cat => ({
        ...cat,
        dishes: allDishes
          .filter(d => d.category_id === cat.id)
          .sort((a, b) => a.display_order - b.display_order)
      }));
  },

  addCategory: async (category: Partial<Category>) => {
    const categories = getLocalData('categories') || [];
    const newCategory = { id: Date.now().toString(), display_order: 0, ...category };
    categories.push(newCategory);
    setLocalData('categories', categories);
    return newCategory;
  },

  updateCategory: async (id: string, category: Partial<Category>) => {
    let categories = getLocalData('categories') || [];
    categories = categories.map((c: any) => c.id === id ? { ...c, ...category } : c);
    setLocalData('categories', categories);
    return { id, ...category };
  },

  deleteCategory: async (id: string) => {
    let categories = getLocalData('categories') || [];
    categories = categories.filter((c: any) => c.id !== id);
    setLocalData('categories', categories);
  },

  addDish: async (dish: Partial<Dish>) => {
    const dishes = getLocalData('dishes') || [];
    const newDish = { id: Date.now().toString(), display_order: 0, ...dish };
    dishes.push(newDish);
    setLocalData('dishes', dishes);
    return newDish;
  },

  updateDish: async (id: string, dish: Partial<Dish>) => {
    let dishes = getLocalData('dishes') || [];
    dishes = dishes.map((d: any) => d.id === id ? { ...d, ...dish } : d);
    setLocalData('dishes', dishes);
    return { id, ...dish };
  },

  deleteDish: async (id: string) => {
    let dishes = getLocalData('dishes') || [];
    dishes = dishes.filter((d: any) => d.id !== id);
    setLocalData('dishes', dishes);
  },

  seedMenu: async (_seedData: any) => {
    setLocalData('categories', null);
    setLocalData('dishes', null);
    initDemoData();
  },
};

// --- Backward Compatibility Exports ---
export const getMenuData = async () => {
    const data = await MenuService.getMenu();
    const dishes = data.flatMap(cat => cat.dishes || []);
    return { categories: data, dishes };
};

export const seedMenuData = (data: any) => MenuService.seedMenu(data);

export const addCategory = (name_en: string, name_ta: string, display_order: number) => 
    MenuService.addCategory({ name_en, name_ta, display_order });

export const updateCategory = (id: string, name_en: string, name_ta: string, display_order: number) => 
    MenuService.updateCategory(id, { name_en, name_ta, display_order });

export const deleteCategory = (id: string) => MenuService.deleteCategory(id);

export const addDish = (category_id: string, name_en: string, name_ta: string, price: number, image_path: string | null, varieties: any[]) => 
    MenuService.addDish({ category_id, name_en, name_ta, price, image_path, varieties: JSON.stringify(varieties) });

export const updateDish = (id: string, category_id: string, name_en: string, name_ta: string, price: number, image_path: string | null, varieties: any[]) => 
    MenuService.updateDish(id, { category_id, name_en, name_ta, price, image_path, varieties: JSON.stringify(varieties) });

export const deleteDish = (id: string) => MenuService.deleteDish(id);

export const updateDishOrder = async (dishes: Dish[]) => {
    let localDishes = getLocalData('dishes') || [];
    dishes.forEach(updateDish => {
        const idx = localDishes.findIndex((d: any) => d.id === updateDish.id);
        if (idx !== -1) {
            localDishes[idx].display_order = updateDish.display_order;
        }
    });
    setLocalData('dishes', localDishes);
    return true;
};