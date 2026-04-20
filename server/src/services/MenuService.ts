import prisma from '../utils/prisma';
import { z } from 'zod';

const categorySchema = z.object({
  nameEn: z.string().min(1),
  nameTa: z.string().min(1),
  displayOrder: z.number().int().optional(),
});

const dishSchema = z.object({
  categoryId: z.number().int(),
  nameEn: z.string().min(1),
  nameTa: z.string().optional(),
  price: z.number().nonnegative(),
  imagePath: z.string().optional().nullable(),
  varieties: z.array(z.any()).optional(),
  displayOrder: z.number().int().optional(),
});

export class MenuService {
  // --- Categories ---
  static async getMenu(tenantId: number) {
    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { displayOrder: 'asc' },
      include: { dishes: { orderBy: { displayOrder: 'asc' } } },
    });

    // Map to snake_case for frontend compatibility
    return categories.map(cat => ({
      id: cat.id,
      name_en: cat.nameEn,
      name_ta: cat.nameTa,
      display_order: cat.displayOrder,
      dishes: cat.dishes.map(d => ({
        id: d.id,
        category_id: d.categoryId,
        name_en: d.nameEn,
        name_ta: d.nameTa,
        price: d.price,
        image_path: d.imagePath,
        varieties: d.varieties,
        display_order: d.displayOrder
      }))
    }));
  }

  static async addCategory(tenantId: number, data: any) {
    const validated = categorySchema.parse(data);
    const cat = await prisma.category.create({
      data: { ...validated, tenantId },
    });
    return {
      id: cat.id,
      name_en: cat.nameEn,
      name_ta: cat.nameTa,
      display_order: cat.displayOrder
    };
  }

  static async updateCategory(tenantId: number, id: number, data: any) {
    const validated = categorySchema.parse(data);
    const cat = await prisma.category.update({
      where: { id, tenantId },
      data: validated,
    });
    return {
      id: cat.id,
      name_en: cat.nameEn,
      name_ta: cat.nameTa,
      display_order: cat.displayOrder
    };
  }

  static async deleteCategory(tenantId: number, id: number) {
    return await prisma.category.delete({
      where: { id, tenantId },
    });
  }

  // --- Dishes ---
  static async addDish(tenantId: number, data: any) {
    const validated = dishSchema.parse(data);
    const { varieties, ...rest } = validated;
    const d = await prisma.dish.create({
      data: { 
        ...rest, 
        tenantId, 
        varieties: varieties ? JSON.stringify(varieties) : '[]' 
      },
    });
    return {
      id: d.id,
      category_id: d.categoryId,
      name_en: d.nameEn,
      name_ta: d.nameTa,
      price: d.price,
      image_path: d.imagePath,
      varieties: d.varieties,
      display_order: d.displayOrder
    };
  }

  static async updateDish(tenantId: number, id: number, data: any) {
    const validated = dishSchema.parse(data);
    const { varieties, ...rest } = validated;
    const d = await prisma.dish.update({
      where: { id, tenantId },
      data: { 
        ...rest, 
        varieties: varieties ? JSON.stringify(varieties) : '[]' 
      },
    });
    return {
      id: d.id,
      category_id: d.categoryId,
      name_en: d.nameEn,
      name_ta: d.nameTa,
      price: d.price,
      image_path: d.imagePath,
      varieties: d.varieties,
      display_order: d.displayOrder
    };
  }

  static async seedMenu(tenantId: number, seedData: any[]) {
    for (const cat of seedData) {
      const category = await prisma.category.create({
        data: {
          tenantId,
          nameEn: cat.nameEn || cat.name_en,
          nameTa: cat.nameTa || cat.name_ta,
          displayOrder: cat.order || cat.display_order || 0,
        },
      });

      if (cat.items && cat.items.length > 0) {
        await prisma.dish.createMany({
          data: cat.items.map((item: any, idx: number) => ({
            tenantId,
            categoryId: category.id,
            nameEn: item.en || item.name_en,
            nameTa: item.ta || item.name_ta,
            price: item.price || 0,
            displayOrder: idx + 1,
            varieties: item.varieties ? JSON.stringify(item.varieties) : '[]',
          })),
        });
      }
    }
  }

}

