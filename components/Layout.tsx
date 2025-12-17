
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { UserRole } from '../types';
import { useLanguage } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

export const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const { role: userRole } = { role }; // Just to keep variable naming consistent if needed

  // Different Navbars based on Role
  return (
    <div className="flex flex-col min-h-screen">
      {role === UserRole.BUYER ? <BuyerNavbar /> : <SellerSidebar>{children}</SellerSidebar>}
      
      {role === UserRole.BUYER && (
        <>
          <main className="flex-grow">
            {children}
          </main>
          <BuyerFooter />
        </>
      )}
    </div>
  );
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <button 
      onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <span className={language === 'en' ? 'text-primary' : 'text-gray-500'}>EN</span>
      <span className="text-gray-300">|</span>
      <span className={language === 'id' ? 'text-primary' : 'text-gray-500'}>ID</span>
    </button>
  );
};

const BuyerNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Sync state with URL param (handle browser back/forward)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/marketplace?q=${encodeURIComponent(query)}`);
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <header className="sticky top-0 z-[1050] w-full border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-8 h-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">RANTU</span>
          </Link>
          
          <div className="hidden md:flex items-center">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500">search</span>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="block w-48 lg:w-64 pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-gray-200 dark:bg-surface-dark text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder={t('searchPlaceholder')}
                />
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/marketplace" className="hover:text-primary transition-colors">{t('marketplace')}</Link>
            <Link to="/chat?tab=ai" className="hover:text-primary transition-colors">{t('aiChatbot')}</Link>
            <Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">({t('sellerDemo')})</Link>
          </nav>
          
          <div className="flex items-center gap-3">
             <LanguageSwitcher />

             {/* Seller Chat/Inbox Icon */}
             <Link 
               to="/chat?tab=inbox" 
               className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 transition-colors text-gray-600 dark:text-gray-300 hover:text-primary"
               title="Chat Penjual"
             >
                <span className="material-symbols-outlined">chat_bubble</span>
             </Link>

             {/* Cart Icon */}
             <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 transition-colors relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
             </Link>
             
             {/* Auth Buttons */}
             <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-3 ml-2">
                <Link to="/auth" className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                   {t('auth.login')}
                </Link>
                <Link to="/auth" className="px-4 py-2 bg-primary text-[#111813] text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                   {t('auth.register')}
                </Link>
                {/* Profile Icon */}
                <Link to="/profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2 border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-4">
          <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500">search</span>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder={t('searchPlaceholder')}
                />
             </div>
          </div>
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">{t('marketplace')}</Link>
            <Link to="/chat?tab=ai" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">{t('aiChatbot')}</Link>
             <Link to="/chat?tab=inbox" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2 flex items-center gap-2">
                Chat Penjual <span className="w-2 h-2 rounded-full bg-red-500"></span>
             </Link>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-primary transition-colors py-2">{t('sellerDemo')}</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-primary transition-colors py-2">
              <span className="material-symbols-outlined">person</span>
              {t('viewProfile')}
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2 flex flex-col gap-2">
               <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-2 text-center text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700 rounded-lg">
                  {t('auth.login')}
               </Link>
               <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-2 text-center bg-primary text-[#111813] font-bold rounded-lg">
                  {t('auth.register')}
               </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const BuyerFooter: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-8 px-8">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <span className="text-primary material-symbols-outlined">eco</span>
             <span className="text-sm text-gray-500">{t('copyright')}</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
             <button className="hover:text-primary bg-transparent border-none cursor-pointer">{t('aboutUs')}</button>
             <button className="hover:text-primary bg-transparent border-none cursor-pointer">{t('contact')}</button>
             <button className="hover:text-primary bg-transparent border-none cursor-pointer">{t('faq')}</button>
             <button className="hover:text-primary bg-transparent border-none cursor-pointer">{t('terms')}</button>
          </div>
       </div>
    </footer>
  );
};

const SellerSidebar: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex-shrink-0 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9MG_tyXDQeHTg1laG2LfyQ4pOw0EmK6JRpzJUnkpGjnZjsISOXwwYrwlSfMmO_gXQmoLOHls2KUIBDy0FMOWpUAYz3Wef7gqycZd_RJFnyutcuA-36xNRtYva0v4ibS-lrGt5W-rE9aL89_ocKuNvmQGg4C-OHfDT1cfBoFz53TUZ71Feo5E8832y6Ia_Rde_fiR3HWTpnSWRKafxSaRVEUEdMIrbeFEL_HpTez_w_NoBk1ZxSlMvOqn62r_b6i7__uJzTK9EivX7")'}}></div>
             <div>
                <h2 className="font-bold text-sm">RANTU Seller</h2>
                <p className="text-xs text-gray-500">AgroFarm</p>
             </div>
          </div>
          
          <nav className="space-y-1">
             <SidebarLink to="/dashboard" icon="dashboard" label={t('dashboard')} />
             <SidebarLink to="/orders" icon="shopping_cart" label={t('orders')} />
             <SidebarLink to="/products" icon="inventory_2" label={t('products')} />
             <SidebarLink to="/analytics" icon="bar_chart" label={t('analytics')} />
             <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
               <Link to="/" className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">logout</span>
                  <span className="text-sm font-medium">{t('backToBuyer')}</span>
               </Link>
             </div>
             <div className="mt-4 px-3">
                <LanguageSwitcher />
             </div>
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark">
        {children}
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ icon: string; label: string; to: string }> = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5'}`}>
      <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </Link>
  );
};
