
import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useLanguage, useCart } from '../App';
import { formatCurrency } from '../constants';

// Add type definition for window.L
declare global {
  interface Window {
    L: any;
  }
}

export const Checkout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </div>
  );
};

const Shipping: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Map Refs and State
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [locationName, setLocationName] = useState("Jambi City (Default)");
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  // Default Coordinates: Jambi
  const DEFAULT_LAT = -1.610122;
  const DEFAULT_LNG = 103.613123;

  useEffect(() => {
    // Check if Leaflet is loaded
    if (window.L && mapContainerRef.current && !mapRef.current) {
      const L = window.L;

      // Fix Icon Paths for Leaflet in this environment
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
         iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
         iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
         shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Initialize Map focused on Jambi
      const map = L.map(mapContainerRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 13);
      mapRef.current = map;

      // Add Tile Layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add Draggable Marker
      const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true }).addTo(map);
      markerRef.current = marker;
      marker.bindPopup("<b>Lokasi Pengiriman</b><br>Geser pin ke lokasi Anda.").openPopup();

      // Event Listener for Drag End
      marker.on('dragend', function (event: any) {
         const position = marker.getLatLng();
         marker.setLatLng(position, { draggable: true }).bindPopup(position).update();
         setLocationName(`Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`);
      });
      
      // Force map invalidation to fix rendering if container size changes
      setTimeout(() => {
         map.invalidateSize();
      }, 100);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
       alert("Geolocation is not supported by your browser");
       return;
    }

    setIsLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
         const { latitude, longitude } = position.coords;
         if (mapRef.current && markerRef.current) {
            const L = window.L;
            mapRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);
            markerRef.current.bindPopup("<b>Lokasi Anda</b>").openPopup();
            setLocationName(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
         }
         setIsLoadingLoc(false);
      },
      (error) => {
         console.error(error);
         alert("Unable to retrieve your location. Please check your permissions.");
         setIsLoadingLoc(false);
      }
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-gray-500 mb-6 font-medium">
         <span className="text-primary">{t('shoppingCart')}</span> / <span className="text-gray-900 dark:text-white">{t('shipping')}</span> / <span>{t('payment')}</span>
      </div>
      
      <h1 className="text-3xl font-black mb-8 text-gray-900 dark:text-white">{t('shippingDetails')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         {/* Form */}
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
               <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('recipientInfo')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                     <label className="block text-sm font-medium mb-1">{t('recipientName')}</label>
                     <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark py-3" placeholder="Masukkan nama lengkap" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">{t('phoneNumber')}</label>
                     <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark py-3" placeholder="+62 812..." />
                  </div>
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('fullAddress')}</label>
                  <textarea className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark py-3" rows={3} placeholder="Alamat jalan, nomor rumah, RT/RW, kelurahan, dll."></textarea>
               </div>
               {/* Delivery Date for Pre-Order */}
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('deliveryDate')}</label>
                  <input 
                     type="date" 
                     min={minDate}
                     className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark py-3" 
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('deliveryDateNote')}</p>
               </div>
            </div>
            <button onClick={() => navigate('/checkout/payment')} className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
               {t('saveAndContinue')}
            </button>
         </div>
         
         {/* Map */}
         <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
               <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('pinLocation')}</h2>
               <p className="text-sm text-gray-500 mb-4">{t('dragPin')}</p>
               
               {/* Interactive Map Container */}
               <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 z-0 flex-1 min-h-[300px]">
                  <div ref={mapContainerRef} className="w-full h-full z-0"></div>
                  
                  {/* Floating Action Button for Location */}
                  <button 
                     onClick={handleUseMyLocation}
                     disabled={isLoadingLoc}
                     className="absolute bottom-4 right-4 z-[400] bg-white dark:bg-surface-dark text-gray-800 dark:text-white p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-70"
                     title="Gunakan Lokasi Saya"
                  >
                     <span className={`material-symbols-outlined ${isLoadingLoc ? 'animate-spin' : ''}`}>
                        {isLoadingLoc ? 'refresh' : 'my_location'}
                     </span>
                  </button>
               </div>

               <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5 text-lg">info</span>
                  <div>
                     <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Lokasi Terpilih:</p>
                     <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">{locationName}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const estimatedShipping = cartItems.length > 0 ? 15000 : 0;
  const estimatedTaxes = cartItems.length > 0 ? 2500 : 0; // consistent with cart logic
  const grandTotal = subtotal + estimatedShipping + estimatedTaxes;

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex gap-2 text-sm text-gray-500 mb-6 font-medium">
         <span className="text-primary">{t('shoppingCart')}</span> / <span className="text-primary">{t('shipping')}</span> / <span className="text-gray-900 dark:text-white">{t('payment')}</span>
      </div>
      <h1 className="text-3xl font-black mb-8 text-gray-900 dark:text-white">{t('securePayment')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-bold text-lg">{t('selectPayment')}</h2>
               </div>
               <div className="p-6 space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-lg cursor-pointer">
                     <input type="radio" name="pay" className="w-5 h-5 text-primary focus:ring-primary" />
                     <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{t('bankTransfer')}</p>
                        <p className="text-sm text-gray-500">{t('payBank')}</p>
                     </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 border-primary bg-primary/5 rounded-lg cursor-pointer">
                     <input type="radio" name="pay" defaultChecked className="w-5 h-5 text-primary focus:ring-primary" />
                     <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{t('ewallet')}</p>
                        <p className="text-sm text-gray-500">{t('payEwallet')}</p>
                     </div>
                  </label>
               </div>
            </div>
            <button onClick={() => navigate('/checkout/confirmation')} className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
               {t('confirmPay')}
            </button>
         </div>

         <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-fit">
            <h3 className="font-bold border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">{t('orderSummary')}</h3>
            <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                  <span className="text-gray-500">{t('subtotal')}</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">{t('estimatedShipping')}</span>
                  <span className="font-medium">{formatCurrency(estimatedShipping)}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">{t('estimatedTaxes')}</span>
                  <span className="font-medium">{formatCurrency(estimatedTaxes)}</span>
               </div>
               <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-2 font-bold text-lg">
                  <span>{t('total')}</span>
                  <span>{formatCurrency(grandTotal)}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const Confirmation: React.FC = () => {
   const navigate = useNavigate();
   const { t } = useLanguage();
   const { cartItems, clearCart } = useCart();

   const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
   const estimatedShipping = cartItems.length > 0 ? 15000 : 0;
   const estimatedTaxes = cartItems.length > 0 ? 2500 : 0;
   const grandTotal = subtotal + estimatedShipping + estimatedTaxes;

   const handleConfirmPayment = () => {
      clearCart();
      navigate('/order-tracking');
   };

   return (
      <div className="max-w-4xl mx-auto">
         <div className="flex flex-wrap gap-2 pb-6 text-sm">
            <span className="text-primary font-medium">{t('shoppingCart')}</span>
            <span className="text-gray-400">/</span>
            <span className="text-primary font-medium">{t('shipping')}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{t('payment')}</span>
         </div>
         <h1 className="text-4xl font-black mb-8">{t('confirmOrder')}</h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                     <div>
                        <h2 className="text-xl font-bold mb-2">{t('shippingTo')}</h2>
                        <p className="font-bold">John Doe</p>
                        <p className="text-gray-500">Jl. Petani No. 123, Desa Makmur, Jambi</p>
                        <p className="text-gray-500">+62 812 3456 7890</p>
                     </div>
                     <button className="text-primary text-sm font-bold bg-primary/10 px-3 py-1 rounded-lg">{t('edit')}</button>
                  </div>
               </div>

               <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                     <div className="w-full">
                        <h2 className="text-xl font-bold mb-2">{t('items')} ({cartItems.length})</h2>
                        <div className="flex flex-col gap-4">
                           {cartItems.map((item) => (
                              <div key={item.id} className="flex gap-4 items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                 <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                 <div className="flex-1">
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{t('quantity')}: {item.quantity} {item.unit}</p>
                                 </div>
                                 <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                           ))}
                           {cartItems.length === 0 && (
                              <p className="text-gray-500 italic">Keranjang kosong.</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               
               <button 
                  onClick={handleConfirmPayment} 
                  disabled={cartItems.length === 0}
                  className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {t('confirmPayment')}
               </button>
            </div>

            <div className="bg-secondary/20 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6 h-fit">
               <h3 className="font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">{t('orderSummary')}</h3>
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">{t('subtotal')}</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">{t('estimatedShipping')}</span><span>{formatCurrency(estimatedShipping)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">{t('estimatedTaxes')}</span><span>{formatCurrency(estimatedTaxes)}</span></div>
                  <div className="flex justify-between text-xl font-black pt-4 border-t border-gray-200 dark:border-gray-700"><span>{t('total')}</span><span>{formatCurrency(grandTotal)}</span></div>
               </div>
            </div>
         </div>
      </div>
   );
}
