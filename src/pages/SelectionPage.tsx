import Layout from '../components/Layout';
import { useCartStore } from '../store/cartStore';
import { Plus, Pencil, Utensils, X, User, MapPin, Calendar, Clock, PartyPopper, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOrder } from '../services/OrderService';
import { useTranslation } from '../context/LanguageProvider';

export default function SelectionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { 
    groups, activeGroupId, addGroup, deleteGroup, setActiveGroup, 
    updateNotes, updateQuantity, removeItem
  } = useCartStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [eventName, setEventName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [address, setAddress] = useState('');

  const [confCustomerName, setConfCustomerName] = useState('');
  const [confEventDate, setConfEventDate] = useState('');
  const [confEventTime, setConfEventTime] = useState('');

  useEffect(() => {}, [groups.length]);

  const activeGroup = groups.find(g => g.id === activeGroupId);

  useEffect(() => {
    if (activeGroup) {
      setConfCustomerName(activeGroup.customerName);
      setConfEventDate(activeGroup.eventDate);
      setConfEventTime(activeGroup.eventTime);
    }
  }, [activeGroup]);

  const handleCreateGroup = () => {
    if (!eventName || !customerName) {
      alert("Please fill in Event Name and Customer Name");
      return;
    }
    addGroup({ name: eventName, customerName, eventDate, eventTime, address });
    setEventName(''); setCustomerName(''); setEventDate(''); setEventTime(''); setAddress('');
    setShowAddModal(false);
  };

  const handleConfirmOrder = async () => {
    if (!activeGroup) return;
    if (!confCustomerName || !confEventDate) {
      alert("Please fill in details.");
      return;
    }

    const result = await saveOrder(activeGroup, { 
      name: confCustomerName, eventName: activeGroup.name, address: activeGroup.address,
      date: confEventDate, time: confEventTime 
    });

    if (result.success) {
      deleteGroup(activeGroup.id);
      navigate('/history');
    } else {
      alert(result.message);
    }
  };

  return (
    <Layout title="Selection">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">{t('selectedDishes')}</h2>
          <p className="text-xs text-gray-400">{t('manageEvents')}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-lg active:scale-90 transition-transform"><Plus size={22} /></button>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {groups.length === 0 && <p className="text-sm text-gray-400 italic">{t('selectionEmpty')}</p>}
        {groups.map(group => (
          <button key={group.id} onClick={() => setActiveGroup(group.id)} className={clsx("rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap transition-colors", activeGroupId === group.id ? "bg-green-600 text-white" : "bg-white text-gray-700 border")}>
            {group.name}
          </button>
        ))}
      </div>

      {activeGroup && (
        <div className="animate-in fade-in-50">
          <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{activeGroup.customerName}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Calendar size={12}/> {activeGroup.eventDate || 'No Date'} 
                  <Clock size={12} className="ml-2"/> {activeGroup.eventTime || '--:--'}
                </div>
                {activeGroup.address && <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><MapPin size={12}/> {activeGroup.address}</div>}
              </div>
              <button onClick={() => deleteGroup(activeGroup.id)} className="text-xs font-bold text-red-500 bg-white px-2 py-1 rounded border border-red-100">{t('delete')}</button>
            </div>
          </div>

          <div className="relative mb-6">
            <Pencil className="absolute left-4 top-4 text-gray-300" size={16} />
            <textarea value={activeGroup.notes} onChange={(e) => updateNotes(e.target.value)} placeholder={t('kitchenInstructions')} className="w-full h-20 rounded-2xl border bg-white p-4 pl-10 text-sm outline-none focus:border-green-500" />
          </div>

          <div className="space-y-3 pb-32">
            {activeGroup.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center"><Utensils className="text-gray-300 mb-2" size={24} /><p className="text-sm text-gray-400">{t('selectionEmpty')}</p><button onClick={() => navigate('/menu')} className="mt-2 text-green-600 font-bold text-sm">{t('browseMenu')}</button></div>
            ) : (
              activeGroup.items.map(item => (
                <div key={`${item.dishId}-${item.varietyName}`} className="flex items-center rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.name_en}</p>
                    <p className="text-xs text-gray-500">{item.name_ta}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={item.quantity} onChange={(e) => { const newQty = parseInt(e.target.value) || 0; const delta = newQty - item.quantity; updateQuantity(item.dishId, item.varietyName, delta); }} className="w-16 h-10 border rounded-lg text-center font-bold text-slate-800 focus:border-green-500 outline-none" />
                    <button onClick={() => removeItem(item.dishId, item.varietyName)} className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeGroup && activeGroup.items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <button onClick={() => setShowConfirm(true)} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700">{t('confirmOrder')}</button>
        </div>
      )}

      {showConfirm && activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50"><h3 className="font-bold text-lg">{t('confirmOrder')}</h3><button onClick={() => setShowConfirm(false)}><X/></button></div>
            <div className="p-5 space-y-4">
              <input type="text" placeholder={t('customerName')} value={confCustomerName} onChange={e => setConfCustomerName(e.target.value)} className="w-full border rounded-xl p-3 text-sm"/>
              <div className="flex gap-3">
                <input type="date" value={confEventDate} onChange={e => setConfEventDate(e.target.value)} className="w-full border rounded-xl p-3 text-sm"/>
                <input type="time" value={confEventTime} onChange={e => setConfEventTime(e.target.value)} className="w-full border rounded-xl p-3 text-sm"/>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-100 rounded-xl p-3 font-bold text-sm">{t('cancel')}</button>
              <button onClick={handleConfirmOrder} className="flex-1 bg-green-600 text-white rounded-xl p-3 font-bold text-sm">{t('save')}</button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50"><h3 className="font-bold text-lg">{t('createOrder')}</h3><button onClick={() => setShowAddModal(false)}><X/></button></div>
            <div className="p-5 space-y-4">
              <div className="relative"><PartyPopper className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder={t('eventName')} value={eventName} onChange={e => setEventName(e.target.value)} className="w-full border rounded-xl p-3 pl-10 text-sm outline-none" /></div>
              <div className="relative"><User className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder={t('customerName')} value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border rounded-xl p-3 pl-10 text-sm outline-none" /></div>
              <div className="relative"><MapPin className="absolute left-3 top-3 text-gray-400" size={18} /><textarea placeholder={t('address')} value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded-xl p-3 pl-10 text-sm outline-none h-20 resize-none" /></div>
              <div className="flex gap-3">
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full border rounded-xl p-3 text-sm" />
                <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full border rounded-xl p-3 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 rounded-xl p-3 font-bold text-sm">{t('cancel')}</button>
              <button onClick={handleCreateGroup} className="flex-1 bg-green-600 text-white rounded-xl p-3 font-bold text-sm">{t('add')}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}