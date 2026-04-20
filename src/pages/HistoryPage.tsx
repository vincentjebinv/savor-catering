import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getOrderHistory, deleteOrder } from '../services/OrderService';
import { Eye, RefreshCw, FileDown, Clock, X, Calendar, StickyNote, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageProvider';

// PDF Imports
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { getSessionUserId } from '../services/SessionService';


// 🟢 PDF STYLES (Matched to your professional catering photo)
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF', color: '#333' },
  headerBanner: {
    backgroundColor: '#b5c4b1', 
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 15,
  },
  logo: { width: 30, height: 30, marginRight: 10, borderRadius: 15 },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FBFADA', 
    letterSpacing: 0.5
  },
  detailsContainer: { marginBottom: 15, paddingHorizontal: 10 },
  fieldGroup: { flexDirection: 'row', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2 },
  fieldLabel: { fontSize: 9, fontWeight: 'bold', width: 100 },
  fieldValue: { fontSize: 9, flex: 1 },
  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  smallFieldGroup: { flexDirection: 'row', width: '48%', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2 },
  menuBox: {
    backgroundColor: '#86A789', 
    borderRadius: 8,
    padding: 20,
    minHeight: 400,
  },
  menuTitle: { fontSize: 13, fontWeight: 'bold', color: '#FBFADA', textAlign: 'center', marginBottom: 15, textDecoration: 'underline' },
  menuGrid: { flexDirection: 'row' },
  menuColumn: { width: '50%' },
  menuItem: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start', paddingRight: 5 },
  itemNumber: { width: 18, color: '#FBFADA', fontSize: 10, fontWeight: 'bold' },
  itemText: { color: '#FBFADA', fontSize: 10, flex: 1 },
  notesWrapper: { marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#B2C8BA' },
  notesTitle: { fontSize: 10, fontWeight: 'bold', color: '#FBFADA', textAlign: 'center', marginBottom: 3 },
  notesText: { fontSize: 9, color: '#FBFADA', fontStyle: 'italic', textAlign: 'center' },
  footer: { position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#888' }
});

// 🟢 PDF DOCUMENT COMPONENT
const OrderPDF = ({ order, appName, logoBase64 }: { order: any, appName: string, logoBase64: string | null }) => {
  // 🛡️ Robust date handling
  let localConfirmTime = '---';
  try {
    if (order.created_at) {
        const d = typeof order.created_at === 'string' ? new Date(order.created_at) : new Date(order.created_at);
        localConfirmTime = d.toLocaleString('en-IN');
    }
  } catch (e) { console.error("PDF Date Error", e); }

  const items = order.items || [];
  const midPoint = Math.ceil(items.length / 2);
  const leftCol = items.slice(0, midPoint);
  const rightCol = items.slice(midPoint);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}>
          {logoBase64 && <Image src={logoBase64} style={styles.logo} />}
          <Text style={styles.headerTitle}>{(appName || 'CATERING').toUpperCase()}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CUSTOMER NAME:</Text>
            <Text style={styles.fieldValue}>{(order.customer_name || '---').toUpperCase()}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EVENT:</Text>
            <Text style={styles.fieldValue}>{(order.event_name || '---').toUpperCase()}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CONFIRMED AT:</Text>
            <Text style={styles.fieldValue}>{localConfirmTime}</Text>
          </View>
          <View style={styles.dateTimeRow}>
            <View style={styles.smallFieldGroup}>
              <Text style={{fontWeight: 'bold', marginRight: 5, fontSize: 9}}>EVENT DATE:</Text>
              <Text style={{fontSize: 9}}>{order.event_date || '---'}</Text>
            </View>
            <View style={styles.smallFieldGroup}>
              <Text style={{fontWeight: 'bold', marginRight: 5, fontSize: 9}}>EVENT TIME:</Text>
              <Text style={{fontSize: 9}}>{order.event_time || '---'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.menuBox}>
          <Text style={styles.menuTitle}>MENU SELECTION</Text>
          <View style={styles.menuGrid}>
            <View style={styles.menuColumn}>
              {leftCol.map((item: any, i: number) => (
                <View key={i} style={styles.menuItem}>
                  <Text style={styles.itemNumber}>{i + 1}.</Text> 
                  <Text style={styles.itemText}>{item.dish_name_en || item.dishNameEn || '---'} x {item.quantity}</Text>
                </View>
              ))}
            </View>
            <View style={styles.menuColumn}>
              {rightCol.map((item: any, i: number) => (
                <View key={i} style={styles.menuItem}>
                  <Text style={styles.itemNumber}>{midPoint + i + 1}.</Text>
                  <Text style={styles.itemText}>{item.dish_name_en || item.dishNameEn || '---'} x {item.quantity}</Text>
                </View>
              ))}
            </View>
          </View>
          {(order.notes && order.notes !== 'undefined') && (
            <View style={styles.notesWrapper}>
              <Text style={styles.notesTitle}>NOTES</Text>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          )}
        </View>
        <Text style={styles.footer}>Crafted by {appName}</Text>
      </Page>
    </Document>
  );
};

export default function HistoryPage() {
  // 🟢 FIXED: Removed unused 'language' variable
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [logoPath, setLogoPath] = useState<string | null>(null);

  const restoreOrder = useCartStore((state) => state.restoreOrder);

  const loadHistory = () => {
    setLoading(true);
    getOrderHistory().then(data => { setOrders(data); setLoading(false); });
    // 🟢 SaaS Logo Loading (Future: Replace with API)
    setLogoPath(null);
  };


  useEffect(() => { loadHistory(); }, []);

  const formatTime = (isoString: string) => {
    if (!isoString) return '---';
    try {
      // The ISO string from the backend already contains timezone info (e.g., 'Z')
      const date = new Date(isoString); 
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleString('en-IN', { 
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const handleDownloadPdf = async (order: any) => {
    setDownloading(order.id);
    try {
        // 🛡️ Create a VERY clean and descriptive filename
        const cleanName = (order.customer_name || 'Customer').replace(/[^a-z0-9]/gi, '_');
        const cleanEvent = (order.event_name || 'Order').replace(/[^a-z0-9]/gi, '_');
        const fileName = `${cleanName}_${cleanEvent}_${order.event_date || 'Date'}.pdf`;

        let logoBase64 = null;
        if (logoPath) {
            try {
                const file = await Filesystem.readFile({ path: logoPath });
                logoBase64 = `data:image/jpeg;base64,${file.data}`;
            } catch (e) { console.error("Logo missing", e); }
        }
        
        const blob = await pdf(<OrderPDF order={order} appName={t('appName')} logoBase64={logoBase64} />).toBlob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        
        if (Capacitor.getPlatform() === 'web') {
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Simplified property access
            
            // 🛡️ Chrome-specific forced click event
            document.body.appendChild(link);
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            link.dispatchEvent(clickEvent);
            
            // 🧹 Longer cleanup to ensure Chrome captures the filename
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
            }, 500);
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = async () => {
                const base64data = (reader.result as string).split(',')[1];
                await Filesystem.writeFile({ 
                    path: fileName, 
                    data: base64data, 
                    directory: Directory.Documents 
                });
                alert(`Success! PDF saved to Documents folder.`);
            };
        }
    } catch (error) { 
        console.error("PDF Error:", error);
        alert("Failed to generate PDF."); 
    } finally { 
        setDownloading(null); 
    }
  };

  const handleRestore = (order: any) => { if (confirm(t('confirmRestore'))) { restoreOrder(order); navigate('/selection'); } };
  const handleDelete = async (orderId: number) => { if (confirm(t('confirmDeleteOrder'))) { await deleteOrder(orderId); loadHistory(); } };

  return (
    <Layout title="History">
      {loading && <p className="text-center py-10">{t('loading')}</p>}
      {!loading && orders.length === 0 && <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500"><Clock size={40} className="mb-4" /><p>{t('noPastOrders')}</p></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div><h3 className="font-bold text-lg text-slate-800">{order.event_name || 'Event'}</h3><p className="text-sm text-gray-500 font-medium">{order.customer_name}</p></div>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase">{order.status}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-400"><Calendar size={12}/> {order.event_date}</div>
                <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold italic">
                   <Clock size={10}/> {formatTime(order.created_at)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t p-3 bg-gray-50/50">
              <button onClick={() => setViewingOrder(order)} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-50 transition-colors"><Eye size={14}/> {t('view')}</button>
              <button onClick={() => handleRestore(order)} className="px-3 py-1.5 bg-white border border-green-200 text-green-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-50 transition-colors"><RefreshCw size={14}/> {t('restore')}</button>
              <button onClick={() => handleDownloadPdf(order)} disabled={downloading === order.id} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                {downloading === order.id ? '...' : <><FileDown size={14}/> {t('pdf')}</>}
              </button>
              <button onClick={() => handleDelete(order.id)} className="p-2 bg-slate-100 text-red-500 rounded-lg hover:bg-red-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-in zoom-in-95 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2"><h3 className="font-bold text-lg">{t('orderDetails')}</h3><button onClick={() => setViewingOrder(null)}><X size={24} /></button></div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500 text-xs">{t('customerName')}</p><p className="font-bold">{viewingOrder.customer_name}</p></div>
                <div><p className="text-gray-500 text-xs">{t('eventName')}</p><p className="font-bold">{viewingOrder.event_name}</p></div>
                <div><p className="text-gray-500 text-xs">Confirmed Time</p><p className="font-bold text-blue-600">{formatTime(viewingOrder.created_at)}</p></div>
              </div>
              {viewingOrder.notes && (<div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100"><p className="text-yellow-700 text-xs font-bold flex items-center gap-1 mb-1"><StickyNote size={12}/> Notes</p><p className="text-gray-700 italic">{viewingOrder.notes}</p></div>)}
              <hr className="my-3" /><h4 className="font-bold mb-2">Items ({viewingOrder.items.length})</h4>
              <div className="space-y-2">
                {viewingOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span>{item.dish_name_en}</span>
                    <span className="font-bold bg-white px-2 rounded shadow-sm border">x {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}