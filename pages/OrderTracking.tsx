
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const OrderTracking: React.FC = () => {
  const navigate = useNavigate();

  const handleChatCourier = () => {
     navigate('/chat', { state: { contactName: 'David Chen (Kurir)', type: 'courier' } });
  };

  return (
    <div className="flex flex-col items-center py-12 px-4">
      {/* Success Banner */}
      <div className="bg-secondary/20 dark:bg-secondary/10 w-full max-w-4xl rounded-xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
           <span className="material-symbols-outlined text-4xl">check</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2 text-gray-900 dark:text-white">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-400">Thank you for your order. Your groceries are on the way.</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Tracking Timeline */}
         <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-6">Order Status</h2>
            <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
               <TimelineItem status="Order Confirmed" time="10:05 AM" active />
               <TimelineItem status="Preparing Shipment" time="11:15 AM" active />
               <TimelineItem status="Out for Delivery" time="12:30 PM" active current />
               <TimelineItem status="Delivered" time="Estimated 1:30 PM" />
            </div>
         </div>

         {/* Map & Courier */}
         <div className="lg:col-span-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-2">Track Your Community Courier</h2>
            <p className="text-sm text-gray-500 mb-4">Follow real-time progress below.</p>
            
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjPQJE0sQ580Gk8Hq6qe82m_R53A0oz5Hg5dz13Cg8xX6tsIAEQQxwOiR0npHLl7jgUgZARm_mWVQ78pOk9fcP-f3qV1gz_5qxAQgM-wqMjxz1Jl-kP0yxvH3dtgEFAeDkSFe3KYS5tlQgfbI7IdRMcWKmTPSc0xHrRkD4qF1n8e6M1QjH-Mu7QYYTPA9ySsQsWg9WNhi1inxoLPZlYiH0mYHugGb_wOsWBuHK9CqkRuKAI-WwK-aULrjLuLKYtgHKU1UsW_aKtENM" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfLjVgfT1KJ3OmEX2orrnQJOzr-maK9suMjOkxs_ZSQwe0B1z9Wx3l_hOj3hMvzcRc1hRcSa0t5iH_lh7g6Qg9vMDFm36qPTxMkHw7BSLhZxySzKBiB2vhy07LrPcXzWf8rXlEGtRxN3mY-kFxUvjPF8LC87HElxi7HZdZHODq-gVbBPSa8a2BYnQkWSdOAZqYH5OR7DNwkH5UGuZfEFgEaH306FXRJTADfXaeLp_Wq9tW62aqmC4wJYCxqWTtSgbYf_uds9KIIF7u")'}}></div>
                  <div>
                     <p className="text-xs text-gray-500">Your Courier</p>
                     <p className="font-bold text-gray-900 dark:text-white">David Chen</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={handleChatCourier} className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors text-sm">
                     Hubungi
                  </button>
               </div>
            </div>
            
            <div className="mt-4 flex justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
               <span className="text-gray-500">Estimated Arrival</span>
               <span className="font-bold text-primary">1:15 PM - 1:30 PM</span>
            </div>
         </div>
      </div>
      
      <Link to="/" className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark">
         Continue Shopping
      </Link>
    </div>
  );
};

const TimelineItem = ({ status, time, active, current }: any) => (
   <div className="relative">
      <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-surface-dark ${active ? 'bg-primary' : 'bg-gray-300'}`}></div>
      <div>
         <p className={`font-medium ${current ? 'text-primary font-bold' : 'text-gray-900 dark:text-white'}`}>{status}</p>
         <p className="text-xs text-gray-500">{time}</p>
      </div>
   </div>
);
