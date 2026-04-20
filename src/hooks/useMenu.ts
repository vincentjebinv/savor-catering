import { useState, useCallback } from 'react';
import { MenuService } from '../services/MenuService';
import type { Category, Dish } from '../services/MenuService';


export const useMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MenuService.getMenu();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (cat: Partial<Category>) => {
    await MenuService.addCategory(cat);
    await fetchData();
  };

  const updateCategory = async (id: number, cat: Partial<Category>) => {
    await MenuService.updateCategory(id, cat);
    await fetchData();
  };

  const deleteCategory = async (id: number) => {
    await MenuService.deleteCategory(id);
    await fetchData();
  };

  // Dish actions follow the same pattern...
  const addDish = async (dish: Partial<Dish>) => {
    await MenuService.addDish(dish);
    await fetchData();
  };

  return {
    categories,
    loading,
    error,
    fetchData,
    addCategory,
    updateCategory,
    deleteCategory,
    addDish,
  };
};
