
import React, { useState, useEffect, createContext, useContext } from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Splash } from './pages/Splash';
import { OrderTracking } from './pages/OrderTracking';
import { About, Settings, Help } from './pages/General';
import { UserRole, CartItem, Product } from './types';
import { TRANSLATIONS, PRODUCTS } from './constants';
import { Farmers } from './pages/Farmers';
import { SellerOrders, SellerProducts, SellerAnalytics } from './pages/SellerPages';

// Language Context
type Language = 'en' | 'id';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Product Context
interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Cart Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.BUYER);
  const [language, setLanguage] = useState<Language>('id'); // Default to Indonesian

  // Initialize Products with constants
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Initialize Cart with some dummy data for demo purposes, referencing current products
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { ...PRODUCTS[0], quantity: 2 }, 
    { ...PRODUCTS[2], quantity: 1 }  
  ]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = TRANSLATIONS[language];
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (value !== undefined) return value;

    let fallback: any = TRANSLATIONS['en'];
    for (const k of keys) {
      fallback = fallback?.[k];
    }

    return fallback !== undefined ? fallback : key;
  };

  // Product Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    // Simulate splash screen loading
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Splash />;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
        <CartContext.Provider value={{ cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
          <MemoryRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/auth" element={<Auth setUserRole={setUserRole} />} />
              
              {/* Buyer Routes */}
              <Route path="/" element={<Layout role={UserRole.BUYER}><Home /></Layout>} />
              <Route path="/marketplace" element={<Layout role={UserRole.BUYER}><Marketplace /></Layout>} />
              <Route path="/farmers" element={<Layout role={UserRole.BUYER}><Farmers /></Layout>} />
              <Route path="/product/:id" element={<Layout role={UserRole.BUYER}><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout role={UserRole.BUYER}><Cart /></Layout>} />
              <Route path="/checkout/*" element={<Layout role={UserRole.BUYER}><Checkout /></Layout>} />
              <Route path="/order-tracking" element={<Layout role={UserRole.BUYER}><OrderTracking /></Layout>} />
              <Route path="/profile" element={<Layout role={UserRole.BUYER}><Profile /></Layout>} />
              <Route path="/chat" element={<Layout role={UserRole.BUYER}><Chat /></Layout>} />
              <Route path="/about" element={<Layout role={UserRole.BUYER}><About /></Layout>} />
              <Route path="/settings" element={<Layout role={UserRole.BUYER}><Settings /></Layout>} />
              <Route path="/help" element={<Layout role={UserRole.BUYER}><Help /></Layout>} />

              {/* Seller Routes */}
              <Route path="/dashboard" element={<Layout role={UserRole.SELLER}><Dashboard /></Layout>} />
              <Route path="/orders" element={<Layout role={UserRole.SELLER}><SellerOrders /></Layout>} />
              <Route path="/products" element={<Layout role={UserRole.SELLER}><SellerProducts /></Layout>} />
              <Route path="/analytics" element={<Layout role={UserRole.SELLER}><SellerAnalytics /></Layout>} />
            </Routes>
          </MemoryRouter>
        </CartContext.Provider>
      </ProductContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
