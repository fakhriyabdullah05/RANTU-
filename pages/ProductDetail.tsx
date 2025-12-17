
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../constants';
import { useLanguage, useCart, useProducts } from '../App';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handlePreOrder = () => {
    // Add to cart and redirect immediately to checkout flow
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleChatSeller = () => {
    navigate('/chat', { state: { contactName: product.farm, type: 'seller' } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">{t('home')}</Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-primary">{t('marketplace')}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
           <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
           </div>
           <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${i===1 ? 'border-primary' : 'border-transparent'}`}>
                   <img src={product.image} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || "Fresh produce sourced directly from local farmers."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase">{tag}</span>
            ))}
             <div className="flex items-center gap-1 text-orange-500 text-sm font-medium ml-auto">
                <span className="material-symbols-outlined filled text-lg">star</span>
                <span>{product.rating}</span>
                <span className="text-gray-400">({product.reviews} {t('reviews')})</span>
             </div>
          </div>

          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6">
             <div className="flex justify-between items-center mb-6">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(product.price * quantity)} <span className="text-base font-normal text-gray-500">/{quantity > 1 ? `${quantity} ${product.unit}` : product.unit}</span>
                </p>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                   <button 
                    onClick={handleDecrement}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-lg font-bold"
                   >
                    -
                   </button>
                   <span className="w-12 text-center font-bold">{quantity}</span>
                   <button 
                    onClick={handleIncrement}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors text-lg font-bold"
                   >
                    +
                   </button>
                </div>
             </div>
             
             <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors active:scale-95 transform"
                  >
                    {t('addToCart')}
                  </button>
                  <button 
                    onClick={handlePreOrder}
                    className="h-12 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-95 transform"
                  >
                    {t('preOrder')}
                  </button>
                </div>
                
                <button 
                  onClick={handleChatSeller}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                   <span className="material-symbols-outlined text-lg">chat</span>
                   Chat Penjual
                </button>
             </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5">
             <div className="w-12 h-12 rounded-full bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsBrwlXkmwMzMBvyhep58i9HOEiVAvS3J6cD7E3BWplN3DbJk89im0R9Xy1U3op4yJjtH8Hh5HzUmDgs9G2e1E4jHs_iT-oSD5ifWMEbWxOR-CSnIUVzv7mmMISAJ8-AMRP181bK-JNnymcpC8ASE43jp2s_5AfG3np2vS0Ecuek4C-luxSttDd2vTje5RPRCFDF0DcBUeaoLCP4zjJgcfubKftH-1Psejhj9IjBgtuSEjkGPmd_Z0f15qxJF23XhcSO8GNovgzkTh")`}}></div>
             <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{product.farm}</h3>
                <p className="text-xs text-gray-500">Jambi, Indonesia</p>
             </div>
             <button onClick={handleChatSeller} className="text-sm font-bold text-primary hover:underline">{t('viewProfile')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
