
import React, { useState } from 'react';
import { useLanguage, useProducts } from '../App';
import { formatCurrency } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Product } from '../types';

// --- SELLER ORDERS ---
const MOCK_ORDERS = [
  { id: '#ORD-001', customer: 'Budi Santoso', date: '22 Okt 2023', total: 150000, status: 'Menunggu', items: 'Cabai Merah (2kg), Tomat (1kg)' },
  { id: '#ORD-002', customer: 'Siti Aminah', date: '21 Okt 2023', total: 75000, status: 'Dikirim', items: 'Bayam Hijau (5 ikat)' },
  { id: '#ORD-003', customer: 'Restoran Sederhana', date: '20 Okt 2023', total: 450000, status: 'Selesai', items: 'Beras Merah (20kg)' },
  { id: '#ORD-004', customer: 'Ahmad Dani', date: '20 Okt 2023', total: 32000, status: 'Selesai', items: 'Jagung Manis (2 pak)' },
];

export const SellerOrders: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('Semua');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'Dikirim': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'Selesai': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filter === 'Semua' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('orders')}</h1>
          <p className="text-gray-500">Kelola pesanan masuk dan status pengiriman.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
        {['Semua', 'Menunggu', 'Dikirim', 'Selesai'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-dark'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white">ID Pesanan</th>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white">Pelanggan</th>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white">Tanggal</th>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white">Total</th>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-white">{order.customer}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{order.items}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-bold">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- SELLER PRODUCTS ---
export const SellerProducts: React.FC = () => {
  const { t } = useLanguage();
  const { products, addProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    unit: 'kg',
    tags: '',
    image: 'https://images.unsplash.com/photo-1595855709915-f76429536053?q=80&w=600&auto=format&fit=crop'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      unit: newProduct.unit,
      farm: 'AgroFarm', // Current Seller
      rating: 0,
      reviews: 0,
      image: newProduct.image,
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(t => t),
      description: 'Produk segar langsung dari kebun AgroFarm.'
    };
    
    addProduct(product);
    setIsModalOpen(false);
    // Reset form but keep a default placeholder image if user doesn't upload
    setNewProduct({ name: '', price: '', unit: 'kg', tags: '', image: 'https://images.unsplash.com/photo-1595855709915-f76429536053?q=80&w=600&auto=format&fit=crop' });
    alert('Produk berhasil ditambahkan!');
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 relative">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('products')}</h1>
          <p className="text-gray-500">Kelola inventaris produk Anda.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Tambah Produk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col group">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-md text-xs font-bold text-gray-700 dark:text-white backdrop-blur-sm">
                Stok: 50 {product.unit}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{product.name}</h3>
              </div>
              <p className="text-primary font-bold mb-4">{formatCurrency(product.price)} <span className="text-xs text-gray-500 font-normal">/{product.unit}</span></p>
              
              <div className="mt-auto grid grid-cols-2 gap-2">
                <button 
                  onClick={() => alert(`Edit produk: ${product.name}`)}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <span className="material-symbols-outlined text-lg">edit</span> Edit
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Hapus produk ${product.name}?`)) {
                      deleteProduct(product.id);
                    }
                  }}
                  className="flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <span className="material-symbols-outlined text-lg">delete</span> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-surface-dark z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tambah Produk Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Produk</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark p-2.5"
                  placeholder="Contoh: Pisang Raja"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Harga (Rp)</label>
                  <input 
                    required
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark p-2.5"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Satuan</label>
                  <select 
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark p-2.5"
                  >
                    <option value="kg">kg</option>
                    <option value="ikat">ikat</option>
                    <option value="pak">pak</option>
                    <option value="buah">buah</option>
                    <option value="sisir">sisir</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tag (Kategori)</label>
                <input 
                  type="text" 
                  value={newProduct.tags}
                  onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-background-dark p-2.5"
                  placeholder="Buah, Segar, Manis (pisahkan dengan koma)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Foto Produk</label>
                
                <div className="flex flex-col gap-3">
                  {/* Image Preview */}
                  <div className="relative w-full aspect-video bg-gray-100 dark:bg-background-dark rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    {newProduct.image ? (
                      <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl">image</span>
                        <span className="text-xs">Pratinjau Foto</span>
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-500">cloud_upload</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Upload Gambar</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                  <p className="text-xs text-gray-500 text-center">Format: JPG, PNG, WebP (Max 5MB)</p>
                </div>
              </div>
              <button type="submit" className="mt-2 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Simpan Produk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SELLER ANALYTICS ---
const SALES_DATA = [
  { month: 'Jan', sales: 4000000 },
  { month: 'Feb', sales: 3000000 },
  { month: 'Mar', sales: 5500000 },
  { month: 'Apr', sales: 4800000 },
  { month: 'Mei', sales: 7000000 },
  { month: 'Jun', sales: 6200000 },
];

const CATEGORY_DATA = [
  { name: 'Sayur', value: 45, color: '#13ec5b' },
  { name: 'Buah', value: 30, color: '#FFC107' },
  { name: 'Bijian', value: 15, color: '#0eb545' },
  { name: 'Rempah', value: 10, color: '#FF5722' },
];

export const SellerAnalytics: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('analytics')}</h1>
        <p className="text-gray-500">Pantau performa penjualan dan tren toko Anda.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-sm font-bold mb-1">Total Pendapatan (Bulan Ini)</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">{formatCurrency(6200000)}</h2>
          <p className="text-green-600 text-sm font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">trending_up</span> +12% vs bulan lalu
          </p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-sm font-bold mb-1">Produk Terjual</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">485 <span className="text-lg font-normal text-gray-400">Unit</span></h2>
          <p className="text-green-600 text-sm font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">trending_up</span> +5% vs bulan lalu
          </p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-sm font-bold mb-1">Rating Toko</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            4.8 <span className="material-symbols-outlined text-yellow-400 text-3xl filled">star</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Dari 120 ulasan</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Tren Penjualan (6 Bulan Terakhir)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `${val/1000000}jt`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="sales" fill="#13ec5b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Penjualan per Kategori</h3>
          <div className="h-64 w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-xs text-gray-500">Total</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">100%</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {CATEGORY_DATA.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-600 dark:text-gray-300">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
