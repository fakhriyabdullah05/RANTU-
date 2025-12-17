
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FARMERS, formatCurrency } from '../constants';
import { useLanguage, useCart, useProducts } from '../App';
import { Product } from '../types';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { products } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Limit to first 4 products for home page display
  const displayProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Carousel */}
      <section className="px-4 sm:px-8 lg:px-12 pt-6 relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-surface-dark/90 rounded-full shadow-lg text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:scale-110"
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div ref={scrollRef} className="flex overflow-x-auto gap-4 no-scrollbar pb-4 snap-x snap-mandatory scroll-smooth">
          <Link to="/marketplace" className="block snap-center">
            <HeroCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuD1jeYyoehH6T0JqYmUVQ8aUmO0UzCNrsmB-QMs3Bu_3gU9tPwOd6h7GVpQcMchap_EZEtZKB-tER2KbCcS_l_7K9opLJdaAJje0BtgcIq7Ih6lyDuzAIot6gAcOciv4dKef2c0cCjFKlpzyHJSNRjI3nvn_TsO-pgNBgrdrWq-r5pGOEhVnpTuim7TULjSXpmKTZAuS73y-8VroXpDE99556kBhFvHdarAn36PZIfoV81H4mXebOoK4GYKQ13ceqy5dsh9Qi4toS5w"
              title={t('hero1Title')}
              subtitle={t('hero1Sub')}
            />
          </Link>
          <Link to="/marketplace" className="block snap-center">
            <HeroCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuA1gh0KvJRWaHSozPi869AKn2zuU0fSRevkOdNAmJe_oSoVUj5uQLzvSio8sYTVHsudJ7Br_iWI68FLxxoygZjmqyLI9_j0cyJbCuG5g9WYlPPk08ruGzXwQ9MJ_kvHPY23OLjdNzrQh6c8195P-PdESqtTxoWghzguzRlbk8uFiZhJHYpUIz6hjukeo4t5vJFYNyw13m6tgE5QfNN68-P_SG4YRGEuEcUi3qoRsYp-oQW8ZGMqAJJOTzx_dJpOU2sMfLg5_WpO0Ij3"
              title={t('hero2Title')}
              subtitle={t('hero2Sub')}
            />
          </Link>
          <Link to="/marketplace" className="block snap-center">
            <HeroCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDvvy7LrhWALhVnofpheeln3S-4rSTeBVxIaPvLNZhOmcK5V9CEBtZqr670-uNN05VJwSRuSWYkwllF2eu2EjGiyMPA5Dn8IlrrRqtdMNWgMdWaI-LM_FMb34yJNX67MIaZaE3xEkLzsa3nZGiXBVHJZPQ7RXWDlq3-1lOCz8mYYrj3_vfESmqN2QT9jGr2ezPz7QU0y9QBKlnBm97iDstAZiOZRPCsRQ-jmA0FHICzpJjBUOiMzOmcCm7CyL5Yo1okmW_THwD61vb-"
              title={t('hero3Title')}
              subtitle={t('hero3Sub')}
            />
          </Link>
          <Link to="/marketplace" className="block snap-center">
            <HeroCard 
              image="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop"
              title="Diskon Spesial: Paket Bumbu Dapur"
              subtitle="Lengkapi bumbu masakanmu dengan harga terbaik minggu ini."
            />
          </Link>
          <Link to="/marketplace" className="block snap-center">
            <HeroCard 
              image="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800&auto=format&fit=crop"
              title="Dukung Petani Lokal: Beras Organik"
              subtitle="Beras merah dan putih kualitas premium langsung dari sawah."
            />
          </Link>
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-surface-dark/90 rounded-full shadow-lg text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:scale-110"
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </section>

      {/* Discover Farmers */}
      <section className="px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('discoverFarmers')}</h2>
          <Link to="/farmers" className="text-primary font-bold hover:underline text-sm hidden sm:block">{t('viewAll')}</Link>
        </div>
        <div className="flex overflow-x-auto gap-6 no-scrollbar pb-4 snap-x snap-mandatory">
          {FARMERS.map(farmer => (
            <FarmerAvatar 
              key={farmer.id}
              name={farmer.name} 
              distance={`${farmer.distance} ${t('away')}`} 
              image={farmer.image}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('freshPicks')}</h2>
          <Link to="/marketplace" className="text-primary font-bold hover:underline">{t('viewAll')}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FAB */}
      <Link to="/chat" className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-background-dark shadow-lg hover:bg-primary-dark transition-colors">
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </Link>
    </div>
  );
};

const HeroCard: React.FC<{ image: string, title: string, subtitle: string }> = ({ image, title, subtitle }) => (
  <div className="flex-shrink-0 w-80 md:w-[420px] flex flex-col gap-3 group cursor-pointer">
    <div className="w-full aspect-[2/1] rounded-xl overflow-hidden bg-gray-200">
       <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div>
       <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{title}</h3>
       <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

const FarmerAvatar: React.FC<{ name: string, distance: string, image: string }> = ({ name, distance, image }) => (
  <div className="flex flex-col items-center gap-2 min-w-[110px] snap-start cursor-pointer group">
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors shadow-sm">
      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 w-full">{name}</p>
      <p className="text-xs text-gray-500">{distance}</p>
    </div>
  </div>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <div>
          <Link to={`/product/${product.id}`}>
             <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-1">by {product.farm}</p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price)} <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
          </p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              navigate('/cart');
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
