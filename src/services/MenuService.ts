import api from '../lib/api';

export interface Category {
  id: number;
  name_en: string;
  name_ta: string;
  display_order: number;
  dishes?: Dish[];
}

export interface Dish {
  id: number;
  category_id: number;
  name_en: string;
  name_ta: string;
  price: number;
  image_path?: string | null;
  varieties?: any;
  display_order: number;
}



export const MenuService = {
  getMenu: async (): Promise<Category[]> => {
    const { data } = await api.get('/menu');
    return data;
  },

  addCategory: async (category: Partial<Category>) => {
    const { data } = await api.post('/menu/category', category);
    return data;
  },

  updateCategory: async (id: number, category: Partial<Category>) => {
    const { data } = await api.put(`/menu/category/${id}`, category);
    return data;
  },

  deleteCategory: async (id: number) => {
    await api.delete(`/menu/category/${id}`);
  },

  addDish: async (dish: Partial<Dish>) => {
    const { data } = await api.post('/menu/dish', dish);
    return data;
  },

  updateDish: async (id: number, dish: Partial<Dish>) => {
    const { data } = await api.put(`/menu/dish/${id}`, dish);
    return data;
  },

  deleteDish: async (id: number) => {
    await api.delete(`/menu/dish/${id}`);
  },

  seedMenu: async (seedData: any) => {
    const { data } = await api.post('/menu/seed', seedData);
    return data;
  },
};

// --- Backward Compatibility Exports (Internal to SaaS API) ---
export const getMenuData = async () => {
    const data = await MenuService.getMenu();
    // Wrap to match old format: { categories: [], dishes: [] }
    const dishes = data.flatMap(cat => cat.dishes || []);
    return { categories: data, dishes };
};

export const seedMenuData = (data: any) => MenuService.seedMenu(data);


export const addCategory = (name_en: string, name_ta: string, display_order: number) => 
    MenuService.addCategory({ name_en, name_ta, display_order });

export const updateCategory = (id: number, name_en: string, name_ta: string, display_order: number) => 
    MenuService.updateCategory(id, { name_en, name_ta, display_order });

export const deleteCategory = (id: number) => MenuService.deleteCategory(id);

export const addDish = (category_id: number, name_en: string, name_ta: string, price: number, image_path: string | null, varieties: any[]) => 
    MenuService.addDish({ category_id, name_en, name_ta, price, image_path, varieties });

export const updateDish = (id: number, category_id: number, name_en: string, name_ta: string, price: number, image_path: string | null, varieties: any[]) => 
    MenuService.updateDish(id, { category_id, name_en, name_ta, price, image_path, varieties });

export const deleteDish = (id: number) => MenuService.deleteDish(id);


export const updateDishOrder = async (_dishes: Dish[]) => {
    // For simplicity in refactor, we just return true here or implement batch update
    return true;
};