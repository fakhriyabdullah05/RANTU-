
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../constants';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage, useCart, useProducts } from '../App';

export const Marketplace: React.FC = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices'];

  // Map English category keys (from state) to Indonesian keywords found in product tags
  const getSearchTerms = (category: string): string[] => {
    switch(category) {
      case 'Vegetables': return ['sayur', 'tomat', 'bayam', 'jagung'];
      case 'Fruits': return ['buah', 'stroberi', 'mangga', 'jeruk'];
      case 'Grains': return ['bijian', 'beras', 'gandum'];
      case 'Spices': return ['rempah', 'cabai', 'bawang', 'kunyit', 'bumbu'];
      default: return [];
    }
  };

  // Auto-reset category to 'All' when a new global search is performed
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory('All');
    }
  }, [searchQuery]);

  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    let categoryMatch = true;
    if (selectedCategory !== 'All') {
        const keywords = getSearchTerms(selectedCategory);
        const tagMatch = p.tags.some(tag => keywords.some(key => tag.toLowerCase().includes(key)));
        const nameMatch = keywords.some(key => p.name.toLowerCase().includes(key));
        categoryMatch = tagMatch || nameMatch;
    }

    // 2. Search Query Filter
    let searchMatch = true;
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        searchMatch = p.name.toLowerCase().includes(lowerQ) || 
                      p.tags.some(tag => tag.toLowerCase().includes(lowerQ)) ||
                      (p.description && p.description.toLowerCase().includes(lowerQ));
    }

    return categoryMatch && searchMatch;
  });

  return (
    <div className="flex flex-col gap-8 pb-12 pt-8 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-end gap-4">
         <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">{t('productCatalog')}</h1>
            <p className="text-gray-500 mt-2">
               {searchQuery ? `Hasil pencarian untuk "${searchQuery}"` : t('browseText')}
            </p>
         </div>
         <div className="flex gap-4">
            <select className="bg-gray-100 dark:bg-surface-dark border-none rounded-lg px-4 py-2 text-sm font-medium">
               <option>{t('sortBy')}</option>
               <option>{t('priceLowHigh')}</option>
               <option>{t('priceHighLow')}</option>
            </select>
         </div>
      </div>

      {/* Chips */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
         {categories.map(cat => (
            <FilterChip 
               key={cat} 
               // @ts-ignore - dynamic key access
               label={t(`categories.${cat}`) || cat} 
               active={selectedCategory === cat} 
               onClick={() => {
                  setSelectedCategory(cat);
                  // Optional: clear search query when manually picking a category, 
                  // or keep it to allow "searching within category".
                  // For now, we keep the query if present.
               }}
            />
         ))}
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {filteredProducts.map(p => (
              <div key={p.id} className="group flex flex-col gap-3 rounded-xl overflow-hidden bg-white dark:bg-surface-dark p-4 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md">
                 <Link to={`/product/${p.id}`} className="block">
                    <div className="w-full aspect-square bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${p.image})`}}></div>
                 </Link>
                 <div className="flex-1 flex flex-col justify-between">
                    <Link to={`/product/${p.id}`} className="block">
                       <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3>
                       <p className="text-sm text-gray-500 mt-1">{formatCurrency(p.price)}/{p.unit}</p>
                       <p className="text-xs text-gray-400 mt-0.5">{t('from')} {p.farm}</p>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(p, 1);
                        navigate('/cart');
                      }}
                      className="mt-4 w-full h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors active:scale-95 shadow-sm"
                    >
                       {t('addToCart')}
                    </button>
                 </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <span className="material-symbols-outlined text-6xl text-gray-300">eco_off</span>
           <p className="mt-4 text-gray-500">
              {searchQuery ? `Tidak ada produk ditemukan untuk "${searchQuery}".` : t('noProducts')}
           </p>
           <button onClick={() => {
              navigate('/marketplace'); // Clear search
              setSelectedCategory('All');
           }} className="mt-4 text-primary font-bold hover:underline">{t('viewAllProducts')}</button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
         <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"><span className="material-symbols-outlined">chevron_left</span></button>
         <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
         <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 font-medium">2</button>
         <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 font-medium">3</button>
         <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"><span className="material-symbols-outlined">chevron_right</span></button>
      </div>
    </div>
  );
};

const FilterChip: React.FC<{ label: string, active?: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
   <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-surface-dark text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
   >
      {label}
   </button>
);
