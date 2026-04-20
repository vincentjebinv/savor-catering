import { create } from 'zustand';

export interface CartItem {
  dishId: number;
  categoryId: number;
  name_en: string;
  name_ta: string;
  quantity: number;
  varietyName: string;
}

export interface SelectionGroup {
  id: string;
  name: string; // This will act as the "Event Name" or Tab Label
  // 🟢 NEW FIELDS
  customerName: string;
  eventDate: string;
  eventTime: string;
  address: string;
  notes: string;
  items: CartItem[];
}

interface CartState {
  groups: SelectionGroup[];
  activeGroupId: string | null;
  
  // 🟢 UPDATED: addGroup now accepts details
  addGroup: (details?: { name: string, customerName: string, eventDate: string, eventTime: string, address: string }) => void;
  deleteGroup: (groupId: string) => void;
  setActiveGroup: (groupId: string) => void;
  updateNotes: (notes: string) => void;
  
  addItem: (item: any) => void;
  removeItem: (dishId: number, varietyName: string) => void;
  updateQuantity: (dishId: number, varietyName: string, delta: number) => void;
  clearActiveGroup: () => void;
  restoreOrder: (historicOrder: any) => void;
  getItemCount: (dishId: number, varietyName?: string) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  groups: [],
  activeGroupId: null,

  // 🟢 UPDATED ADD GROUP
  addGroup: (details) => set((state) => {
    const newId = Date.now().toString();
    const newGroup: SelectionGroup = {
      id: newId,
      name: details?.name || `Order ${state.groups.length + 1}`,
      customerName: details?.customerName || '',
      eventDate: details?.eventDate || '',
      eventTime: details?.eventTime || '',
      address: details?.address || '',
      notes: '',
      items: [],
    };
    return { 
      groups: [...state.groups, newGroup],
      activeGroupId: newId
    };
  }),

  deleteGroup: (groupId) => set((state) => {
    const remainingGroups = state.groups.filter(g => g.id !== groupId);
    const newActiveId = state.activeGroupId === groupId ? (remainingGroups.length > 0 ? remainingGroups[0].id : null) : state.activeGroupId;
    return { groups: remainingGroups, activeGroupId: newActiveId };
  }),

  setActiveGroup: (groupId) => set({ activeGroupId: groupId }),

  updateNotes: (notes) => set((state) => {
    if (!state.activeGroupId) return state;
    return { groups: state.groups.map(g => g.id === state.activeGroupId ? { ...g, notes } : g) };
  }),

  addItem: (newItem) => set((state) => {
    let currentGroups = state.groups;
    let currentActiveId = state.activeGroupId;

    if (!currentActiveId || currentGroups.length === 0) {
      const newId = Date.now().toString();
      // Default empty group if user adds item without creating group first
      const newGroup: SelectionGroup = { id: newId, name: 'New Order', customerName: '', eventDate: '', eventTime: '', address: '', notes: '', items: [] };
      currentGroups = [...currentGroups, newGroup];
      currentActiveId = newId;
    }

    const updatedGroups = currentGroups.map(g => {
      if (g.id !== currentActiveId) return g;
      const existing = g.items.find(i => i.dishId === newItem.dishId && i.varietyName === newItem.varietyName);
      if (existing) {
        return { ...g, items: g.items.map(i => (i.dishId === newItem.dishId && i.varietyName === newItem.varietyName) ? { ...i, quantity: i.quantity + 1 } : i) };
      } else {
        return { ...g, items: [...g.items, { ...newItem, quantity: 1 }] };
      }
    });

    return { groups: updatedGroups, activeGroupId: currentActiveId };
  }),

  updateQuantity: (dishId, varietyName, delta) => set((state) => {
    if (!state.activeGroupId) return state;
    return {
      groups: state.groups.map(g => {
        if (g.id !== state.activeGroupId) return g;
        return {
          ...g,
          items: g.items.map(item => (item.dishId === dishId && item.varietyName === varietyName) ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0)
        };
      })
    };
  }),

  removeItem: (dishId, varietyName) => set((state) => {
    if (!state.activeGroupId) return state;
    return { groups: state.groups.map(g => g.id === state.activeGroupId ? { ...g, items: g.items.filter(i => !(i.dishId === dishId && i.varietyName === varietyName)) } : g) };
  }),
  
  clearActiveGroup: () => set((state) => {
    if (!state.activeGroupId) return state;
    return { groups: state.groups.map(g => g.id === state.activeGroupId ? { ...g, items: [] } : g) };
  }),

  restoreOrder: (historicOrder) => set((state) => {
    const newId = Date.now().toString();
    const newGroup: SelectionGroup = {
      id: newId,
      name: historicOrder.event_name || `Restored Order`,
      customerName: historicOrder.customer_name || '',
      eventDate: historicOrder.event_date || '',
      eventTime: historicOrder.event_time || '',
      address: historicOrder.address || '',
      notes: historicOrder.notes || '',
      items: historicOrder.items.map((item: any) => ({
        dishId: item.id || Date.now(),
        categoryId: 0,
        name_en: item.dish_name_en,
        name_ta: item.dish_name_ta,
        quantity: item.quantity,
        varietyName: item.varietyName || 'Main Dish'
      })),
    };
    return { groups: [...state.groups, newGroup], activeGroupId: newId };
  }),
  
  getItemCount: (dishId, varietyName = 'Main Dish') => {
    const { groups, activeGroupId } = get();
    const activeGroup = groups.find(g => g.id === activeGroupId);
    if (!activeGroup) return 0;
    const item = activeGroup.items.find(i => i.dishId === dishId && i.varietyName === varietyName);
    return item ? item.quantity : 0;
  }
}));