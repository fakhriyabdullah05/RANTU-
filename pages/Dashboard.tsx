
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { formatCurrency } from '../constants';

const DATA = [
  { name: 'Mon', Chili: 40000, Onion: 24000 },
  { name: 'Tue', Chili: 30000, Onion: 13980 },
  { name: 'Wed', Chili: 20000, Onion: 98000 },
  { name: 'Thu', Chili: 27800, Onion: 39080 },
  { name: 'Fri', Chili: 18900, Onion: 48000 },
  { name: 'Sat', Chili: 23900, Onion: 38000 },
  { name: 'Sun', Chili: 34900, Onion: 43000 },
];

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
       {/* Header */}
       <div className="flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
             <p className="text-gray-500">{t('welcomeBack')}</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
             <span className="material-symbols-outlined">add</span>
             {t('addNewProduct')}
          </button>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label={t('totalSales')} value={formatCurrency(1250000)} trend={`+5.2% ${t('vsYesterday')}`} trendUp={true} />
          <StatCard label={t('newOrders')} value="12" trend={`+2 ${t('awaitingDispatch')}`} trendUp={true} />
          <StatCard label={t('activeBalance')} value={formatCurrency(5800000)} trend={`-1.5% ${t('vsLastWeek')}`} trendUp={false} />
       </div>

       {/* AI Prediction */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('commodityTrends')}</h3>
                <div className="flex gap-4 text-sm">
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span> Chili</div>
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span> Onion</div>
                </div>
             </div>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9ca3af" axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 12}} stroke="#9ca3af" axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Line type="monotone" dataKey="Chili" stroke="#13ec5b" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="Onion" stroke="#FFC107" strokeWidth={3} dot={false} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl flex flex-col gap-4">
             <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span className="font-bold text-lg">{t('aiInsight')}</span>
             </div>
             <p className="text-gray-900 dark:text-white">
               {t('aiInsightText')}
             </p>
             <p className="text-sm text-gray-600 dark:text-gray-400">
               {t('aiInsightSub')}
             </p>
             <button className="mt-auto w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">
               {t('adjustPricing')}
             </button>
          </div>
       </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, trendUp }: any) => (
  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
     <p className="text-gray-500 text-sm font-medium">{label}</p>
     <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-1">{value}</p>
     <p className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>{trend}</p>
  </div>
);
