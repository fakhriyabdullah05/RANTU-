
import React from 'react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[80vh]">
       {/* Header with Blank Profile */}
       <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-surface-dark border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center mb-4 shadow-sm">
             <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">person</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Nama Pengguna</h1>
          <p className="text-gray-500 text-sm">user@example.com</p>
       </div>

       {/* Menu List */}
       <div className="flex flex-col gap-3">
          <MenuButton icon="info" label="Tentang Kami" to="/about" />
          <MenuButton icon="history" label="Aktivitas Saya" to="/order-tracking" />
          <MenuButton icon="settings" label="Pengaturan Akun" to="/settings" />
          <MenuButton icon="help" label="Pusat Bantuan" to="/help" />
          
          <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>
          
          <MenuButton icon="logout" label="Keluar" to="/auth" isDestructive />
       </div>
    </div>
  );
};

interface MenuButtonProps {
  icon: string;
  label: string;
  to: string;
  isDestructive?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, to, isDestructive }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group ${isDestructive ? 'hover:border-red-200 dark:hover:border-red-900/50' : ''}`}
    >
       <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-primary/10 text-primary'}`}>
             <span className="material-symbols-outlined">{icon}</span>
          </div>
          <span className={`font-bold ${isDestructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{label}</span>
       </div>
       <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
    </Link>
  );
};
