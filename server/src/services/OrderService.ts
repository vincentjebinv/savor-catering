import prisma from '../utils/prisma';
import { z } from 'zod';

const orderItemSchema = z.object({
  dishNameEn: z.string().optional(),
  dishNameTa: z.string().optional(),
  quantity: z.number().int().min(1),
  categoryName: z.string().optional(),
});

const orderSchema = z.object({
  customerName: z.string().optional(),
  eventName: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export class OrderService {
  static async getOrders(tenantId: number) {
    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    // Map to snake_case for frontend
    return orders.map(o => ({
      id: o.id,
      customer_name: o.customerName,
      event_name: o.eventName,
      address: o.address,
      event_date: o.eventDate,
      event_time: o.eventTime,
      notes: o.notes,
      status: o.status,
      created_at: o.createdAt,
      items: o.items.map(i => ({
        id: i.id,
        dish_name_en: i.dishNameEn,
        dish_name_ta: i.dishNameTa,
        quantity: i.quantity,
        category_name: i.categoryName
      }))
    }));
  }

  static async createOrder(tenantId: number, data: any) {
    const validated = orderSchema.parse(data);
    const { items, ...rest } = validated;

    return await prisma.order.create({
      data: {
        ...rest,
        tenantId,
        items: {
          create: items.map(i => ({
            dishNameEn: i.dishNameEn,
            dishNameTa: i.dishNameTa,
            quantity: i.quantity,
            categoryName: i.categoryName
          }))
        }
      },
      include: { items: true }
    });
  }

  static async deleteOrder(tenantId: number, id: number) {
    return await prisma.order.delete({
      where: { id, tenantId }
    });
  }
}
