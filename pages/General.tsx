
import React, { useState } from 'react';
import { useLanguage } from '../App';
import { Link } from 'react-router-dom';

// --- ABOUT PAGE ---
export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Tentang RANTU</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Revolusi Pertanian Digital untuk Kesejahteraan Petani dan Kepuasan Konsumen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop" 
            alt="Petani RANTU" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Misi Kami</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            RANTU hadir untuk memangkas rantai distribusi pangan yang panjang. Kami menghubungkan petani lokal langsung dengan konsumen akhir melalui teknologi.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Dengan RANTU, petani mendapatkan harga yang layak, dan pembeli mendapatkan produk segar berkualitas dengan harga transparan. Kami percaya teknologi dapat membawa keadilan bagi pahlawan pangan kita.
          </p>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mengapa Memilih Kami?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">freshness</span>
            <h4 className="font-bold mb-1">Garansi Segar</h4>
            <p className="text-sm text-gray-500">Langsung dipanen saat ada pesanan.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">handshake</span>
            <h4 className="font-bold mb-1">Fair Trade</h4>
            <p className="text-sm text-gray-500">Harga adil untuk kesejahteraan petani.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">rocket_launch</span>
            <h4 className="font-bold mb-1">Pengiriman Cepat</h4>
            <p className="text-sm text-gray-500">Logistik terintegrasi sampai ke rumah.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SETTINGS PAGE ---
export const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState({
    email: true,
    promo: false,
    order: true,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Pengaturan Akun</h1>

      {/* Profile Section */}
      <section className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profil Saya</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-gray-400">person</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Nama Pengguna</p>
            <p className="text-gray-500 text-sm">user@example.com</p>
          </div>
          <button className="ml-auto text-primary font-bold text-sm hover:underline">Edit</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
            <input type="text" value="Nama Pengguna" disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nomor Telepon</label>
            <input type="text" value="+62 812 3456 7890" disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-gray-500" />
          </div>
        </div>
      </section>

      {/* App Settings */}
      <section className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferensi Aplikasi</h2>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <div>
            <p className="font-medium">Bahasa / Language</p>
            <p className="text-xs text-gray-500">Pilih bahasa tampilan aplikasi.</p>
          </div>
          <div className="flex bg-gray-100 dark:bg-background-dark rounded-lg p-1">
            <button 
              onClick={() => setLanguage('id')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'id' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-gray-500'}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-gray-500'}`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <div>
            <p className="font-medium">Notifikasi Pesanan</p>
            <p className="text-xs text-gray-500">Info status pengiriman dan pesanan.</p>
          </div>
          <Toggle checked={notifications.order} onChange={() => setNotifications(prev => ({...prev, order: !prev.order}))} />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Info Promo & Diskon</p>
            <p className="text-xs text-gray-500">Dapatkan penawaran terbaik dari petani.</p>
          </div>
          <Toggle checked={notifications.promo} onChange={() => setNotifications(prev => ({...prev, promo: !prev.promo}))} />
        </div>
      </section>

      {/* Security */}
      <section className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Keamanan</h2>
        <button className="w-full text-left flex items-center justify-between py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
          <span>Ubah Kata Sandi</span>
          <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
        </button>
      </section>
    </div>
  );
};

const Toggle: React.FC<{ checked: boolean, onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
  </button>
);

// --- HELP PAGE ---
export const Help: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Pusat Bantuan</h1>
        <p className="text-gray-500">Punya pertanyaan? Kami siap membantu Anda.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
        <input 
          type="text" 
          placeholder="Cari topik bantuan (misal: pengiriman, pembayaran)" 
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {/* FAQ Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary transition-colors cursor-pointer group">
          <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary mb-2">shopping_cart</span>
          <h3 className="font-bold">Pesanan</h3>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary transition-colors cursor-pointer group">
          <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary mb-2">payments</span>
          <h3 className="font-bold">Pembayaran</h3>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-primary transition-colors cursor-pointer group">
          <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary mb-2">local_shipping</span>
          <h3 className="font-bold">Pengiriman</h3>
        </div>
      </div>

      {/* FAQ List */}
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Pertanyaan Populer</h2>
      <div className="space-y-4">
        <FaqItem 
          question="Bagaimana cara melacak pesanan saya?" 
          answer="Anda dapat melacak pesanan melalui menu 'Aktivitas Saya' di halaman Profil, atau klik tombol 'Lacak' pada notifikasi pesanan."
        />
        <FaqItem 
          question="Apakah bisa membatalkan pesanan?" 
          answer="Pesanan dapat dibatalkan selama statusnya masih 'Menunggu Konfirmasi'. Jika sudah diproses, silakan hubungi Customer Service kami."
        />
        <FaqItem 
          question="Metode pembayaran apa saja yang tersedia?" 
          answer="Kami menerima pembayaran via Transfer Bank (BCA, Mandiri, BRI, BNI) dan E-Wallet (GoPay, OVO, Dana)."
        />
        <FaqItem 
          question="Bagaimana jika produk yang diterima rusak?" 
          answer="Kami memberikan garansi kesegaran. Silakan foto produk yang rusak dan ajukan komplain maksimal 1x24 jam setelah barang diterima untuk penggantian dana atau produk."
        />
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-gray-50 dark:bg-white/5 rounded-xl p-8 text-center">
        <p className="font-bold text-lg mb-2">Masih butuh bantuan?</p>
        <p className="text-gray-500 mb-6">Tim support kami siap membantu Anda 24/7.</p>
        <button className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 mx-auto">
          <span className="material-symbols-outlined">chat</span>
          Chat dengan CS
        </button>
      </div>
    </div>
  );
};

const FaqItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-900 dark:text-white"
      >
        {question}
        <span className={`material-symbols-outlined transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 mt-2">
          {answer}
        </div>
      )}
    </div>
  );
};
