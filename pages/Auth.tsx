
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useLanguage } from '../App';

interface AuthProps {
  setUserRole: (role: UserRole) => void;
}

export const Auth: React.FC<AuthProps> = ({ setUserRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(role);
    if (role === UserRole.SELLER) {
       navigate('/dashboard'); 
    } else {
       navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-surface-dark min-h-[600px]">
         {/* Left: Image */}
         <div className="hidden md:flex flex-col justify-end p-10 text-white bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop")'}}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-5xl">eco</span>
                  <h1 className="text-5xl font-black">RANTU</h1>
               </div>
               <p className="text-xl font-medium text-gray-200">Smarter Farming, Fresher Food.</p>
            </div>
         </div>

         {/* Right: Form */}
         <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-surface-dark">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('auth.welcome')}</h2>
            <p className="text-gray-500 mb-8">{t('auth.subtitle')}</p>

            {/* Role Selection */}
            <div className="mb-6">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('auth.role')}</label>
               <div className="flex bg-gray-100 dark:bg-background-dark p-1 rounded-lg">
                  <button 
                     type="button"
                     onClick={() => setRole(UserRole.BUYER)} 
                     className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === UserRole.BUYER ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                     <span className="material-symbols-outlined text-lg">shopping_basket</span>
                     {t('auth.buyer')}
                  </button>
                  <button 
                     type="button"
                     onClick={() => setRole(UserRole.SELLER)} 
                     className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === UserRole.SELLER ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                     <span className="material-symbols-outlined text-lg">agriculture</span>
                     {t('auth.seller')}
                  </button>
               </div>
            </div>

            {/* Login/Register Toggle */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
               <button 
                  onClick={() => setIsLogin(true)} 
                  className={`pb-2 px-4 text-sm font-bold transition-colors border-b-2 ${isLogin ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                  {t('auth.login')}
               </button>
               <button 
                  onClick={() => setIsLogin(false)} 
                  className={`pb-2 px-4 text-sm font-bold transition-colors border-b-2 ${!isLogin ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                  {t('auth.register')}
               </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
               {!isLogin && (
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.fullName')}</label>
                     <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="John Doe" />
                  </div>
               )}
               <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.email')}</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="name@example.com" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
                  <input required type="password" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="••••••••" />
               </div>
               
               <button className="w-full py-3.5 bg-primary text-[#111813] font-bold text-lg rounded-xl hover:bg-primary-dark transition-colors mt-6 shadow-lg shadow-primary/20">
                  {isLogin ? t('auth.login') : t('auth.register')}
               </button>
            </form>

            <div className="relative my-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-surface-dark text-gray-500 font-medium">{t('auth.or')}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold text-sm text-gray-700 dark:text-gray-300">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQD6875cEDw6axCUr_BRy5_fBHAgqbgbrLB2UXoBMVb7FJXeZv7PSBjSAHPR_zwclmZNetxTLxJfItoI8LLmlaEPv2hRdCms3Z71ysU72WGSJes9HPygs0a_2HuWhqy4wurX0vong2SMcjSdgQO7LC1KI9NeUg1cFwEqitqINTtqKGpOIe1RfvOShdAVwtvkKjI09E1_1wkRsyoVQnW13nn5HYbI0USbqFd9WJGAgqDYr655syJWLDodoLBTtWkqIxFe7085pPPd10" className="w-5 h-5" alt="Google" />
                  Google
               </button>
               <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold text-sm text-gray-700 dark:text-gray-300">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3szA5vMXW9nO5hSuiHH9Mij-MzzGNuupVdXMvUcJTn-k45kk1o9gPc6HVQ5OprbGygpD6aFRBr_7GD7hVASjHo-YcWFR4OAaHt0k7O5aWis7Q-6EOz9aRsF6vqmjWxDP_qULga6FGSCx1bVbt1z1BuFLcEvHfRFReBL0TKafpEw3XF2MyNvt0EgyBuSH03QxGOXY3b1TMSyXtkwLwCPFn_sjJ-2Ggo2x3UrPnTLKsMW1mJceDemDeMNO-v9pEvGXwtVc2RMXCAE3I" className="w-5 h-5" alt="Facebook" />
                  Facebook
               </button>
            </div>

            <p className="text-center text-sm mt-8 text-gray-500">
                {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
                <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:underline ml-1">
                   {isLogin ? t('auth.register') : t('auth.login')}
                </button>
            </p>
         </div>
      </div>
    </div>
  );
};
