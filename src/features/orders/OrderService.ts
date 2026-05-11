export interface Order {
  id: string;
  customerName: string;
  eventName: string;
  eventDate: string;
  status: string;
  items: any[];
  createdAt?: any;
}

const getLocalData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setLocalData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const OrderService = {
  getOrders: async (): Promise<Order[]> => {
    const orders: Order[] = getLocalData('orders') || [];
    return orders.sort((a, b) => {
      const dateA = a.createdAt || 0;
      const dateB = b.createdAt || 0;
      return dateB - dateA;
    });
  },

  createOrder: async (order: Partial<Order>) => {
    const orders = getLocalData('orders') || [];
    const newOrder = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: order.status || 'pending',
      ...order
    };
    orders.push(newOrder);
    setLocalData('orders', orders);
    return newOrder;
  },

  updateOrderStatus: async (id: string, status: string) => {
    let orders = getLocalData('orders') || [];
    orders = orders.map((o: any) => o.id === id ? { ...o, status } : o);
    setLocalData('orders', orders);
    return { id, status };
  },

  deleteOrder: async (id: string) => {
    let orders = getLocalData('orders') || [];
    orders = orders.filter((o: any) => o.id !== id);
    setLocalData('orders', orders);
  },
};

// --- Backward Compatibility ---
export const getOrders = () => OrderService.getOrders();
export const getOrderHistory = () => OrderService.getOrders();

export const saveOrder = async (activeGroup: any, details: any) => {
    try {
        const orderData = {
            customerName: details.name || 'Demo Customer',
            eventName: details.eventName || 'Demo Event',
            address: details.address || 'Demo Address',
            eventDate: details.date || '',
            eventTime: details.time || '',
            notes: activeGroup.notes || '',
            items: (activeGroup.items || []).filter((item: any) => item.quantity > 0).map((item: any) => ({
                dish_id: item.dishId,
                dish_name_en: item.name_en || '',
                dish_name_ta: item.name_ta || '',
                quantity: item.quantity || 0,
                category_id: item.categoryId,
                category_name: item.categoryName || ''
            }))
        };
        await OrderService.createOrder(orderData);
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const updateOrderStatus = (id: string, status: string) => OrderService.updateOrderStatus(id, status);
export const deleteOrder = (id: string) => OrderService.deleteOrder(id);