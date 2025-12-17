
import React from 'react';
import { useLanguage } from '../App';
import { FARMERS } from '../constants';
import { Link } from 'react-router-dom';

export const Farmers: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t('allFarmers')}</h1>
        <p className="text-gray-500">{t('farmersSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {FARMERS.map((farmer) => (
          <div key={farmer.id} className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 group-hover:border-primary/20 transition-colors">
              <img 
                src={farmer.image} 
                alt={farmer.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{farmer.name}</h3>
              <p className="text-sm text-gray-500">{farmer.location}</p>
              <p className="text-xs text-primary font-medium mt-1">{farmer.distance} {t('away')}</p>
            </div>
            <button className="mt-2 text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
              {t('viewProfile')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
