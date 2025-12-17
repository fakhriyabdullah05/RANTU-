
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useCart } from '../App';
import { formatCurrency } from '../constants';
import { CartItem } from '../types';

export const Cart: React.FC = () => {
  const { t } = useLanguage();
  const { cartItems, updateCartQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const estimatedShipping = cartItems.length > 0 ? 15000 : 0;
  const estimatedTaxes = cartItems.length > 0 ? 2500 : 0;
  const grandTotal = subtotal + estimatedShipping + estimatedTaxes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-2 text-sm text-gray-500 mb-6 font-medium">
         <Link to="/marketplace" className="hover:text-primary">{t('marketplace')}</Link> / <span className="text-gray-900 dark:text-white">{t('shoppingCart')}</span>
      </div>
      
      <h1 className="text-4xl font-black mb-8 text-gray-900 dark:text-white">{t('myCart')} ({cartItems.length} {t('items')})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
         {/* Cart Items */}
         <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark">
               <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5">
                     <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 w-2/5">{t('product')}</th>
                        <th className="px-6 py-3 w-1/5">{t('price')}</th>
                        <th className="px-6 py-3 w-1/5">{t('quantity')}</th>
                        <th className="px-6 py-3 w-1/5">{t('total')}</th>
                        <th className="px-6 py-3"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                     {cartItems.map((item) => (
                       <CartRow 
                          key={item.id}
                          item={item}
                          onIncrease={() => updateCartQuantity(item.id, 1)}
                          onDecrease={() => updateCartQuantity(item.id, -1)}
                          onDelete={() => removeFromCart(item.id)}
                       />
                     ))}
                     {cartItems.length === 0 && (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                              Keranjang belanja Anda kosong.
                              <Link to="/marketplace" className="block mt-2 text-primary font-bold hover:underline">Mulai Belanja</Link>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Summary */}
         {cartItems.length > 0 && (
            <div className="lg:col-span-1">
               <div className="bg-white dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-24">
                  <h2 className="text-lg font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">{t('orderSummary')}</h2>
                  <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('estimatedShipping')}</span>
                        <span className="font-medium">{formatCurrency(estimatedShipping)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('estimatedTaxes')}</span>
                        <span className="font-medium">{formatCurrency(estimatedTaxes)}</span>
                     </div>
                     <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-bold text-gray-900 dark:text-white">{t('grandTotal')}</span>
                        <span className="text-xl font-bold">{formatCurrency(grandTotal)}</span>
                     </div>
                  </div>
                  <Link to="/checkout" className="mt-6 w-full flex items-center justify-center rounded-lg h-12 bg-primary text-black font-bold hover:opacity-90 transition-opacity">
                     {t('proceedToCheckout')}
                  </Link>
                  <Link to="/marketplace" className="mt-4 block text-center text-sm font-medium text-primary hover:underline">
                     {t('continueShopping')}
                  </Link>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

const CartRow: React.FC<{ item: CartItem, onIncrease: () => void, onDecrease: () => void, onDelete: () => void }> = ({ item, onIncrease, onDecrease, onDelete }) => (
  <tr>
     <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
           <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover mr-4" />
           <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
              <div className="text-sm text-gray-500">{item.farm}</div>
           </div>
        </div>
     </td>
     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatCurrency(item.price)}</td>
     <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md max-w-min">
           <button onClick={onDecrease} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold">-</button>
           <span className="w-8 text-center">{item.quantity}</span>
           <button onClick={onIncrease} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold">+</button>
        </div>
     </td>
     <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</td>
     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <button onClick={onDelete} className="text-red-500 hover:text-red-700"><span className="material-symbols-outlined">delete</span></button>
     </td>
  </tr>
);
