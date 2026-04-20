import api from '../lib/api';

export interface Order {
  id: number;
  customerName: string;
  eventName: string;
  eventDate: string;
  status: string;
  items: any[];
}

export const OrderService = {
  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data;
  },

  createOrder: async (order: Partial<Order>) => {
    const { data } = await api.post('/orders', order);
    return data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  deleteOrder: async (id: number) => {
    await api.delete(`/orders/${id}`);
  },
};

// --- Backward Compatibility ---
export const getOrders = () => OrderService.getOrders();
export const getOrderHistory = () => OrderService.getOrders();

export const saveOrder = async (activeGroup: any, details: any) => {
    try {
        // Map the existing frontend data structure to the backend Order schema
        const orderData = {
            customerName: details.name,
            eventName: details.eventName,
            address: details.address,
            eventDate: details.date,
            eventTime: details.time,
            notes: activeGroup.notes,
            items: activeGroup.items.map((item: any) => ({
                dishNameEn: item.name_en,
                dishNameTa: item.name_ta,
                quantity: item.quantity,
                categoryName: item.category_name
            }))
        };
        await OrderService.createOrder(orderData);
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.response?.data?.message || e.message };
    }
};
export const updateOrderStatus = (id: number, status: string) => OrderService.updateOrderStatus(id, status);
export const deleteOrder = (id: number) => OrderService.deleteOrder(id);