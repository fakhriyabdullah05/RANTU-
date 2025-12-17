
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

interface Message {
  id: number;
  sender: 'user' | 'bot' | 'seller';
  text: string;
  time: string;
}

interface ChatSession {
  id: string; 
  contactName: string;
  type: 'ai' | 'seller' | 'courier';
  avatar?: string;
  messages: Message[];
  lastMessage: string;
  timestamp: string;
  unread?: number;
}

const AI_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCE1mbKs8zpCkavsobpBK59ntitGoTeV5lxpzwu7E89smRKhMvnZG7K_lHzjUrbOyhDGsYp0t1dk34kjwJPuxRIvam1lH2AVrKDjP56r4NB_3ddjfevyeMndkuzpb8HXkVjYGYjENrHhHUu_wSLpCn6fWl2cN8PblKM7Gat2BPqMfqGWdNrIDGZA-CKF7OqrGhdfKFK3PYUyvZe3KV0lLzclzigF1o0zUv6JdO-yy0R-COwGSP4l9ANeRMW4ytEcrepg7h5YCM9u6E9";
const SELLER_AVATAR_DEFAULT = "https://lh3.googleusercontent.com/aida-public/AB6AXuBsBrwlXkmwMzMBvyhep58i9HOEiVAvS3J6cD7E3BWplN3DbJk89im0R9Xy1U3op4yJjtH8Hh5HzUmDgs9G2e1E4jHs_iT-oSD5ifWMEbWxOR-CSnIUVzv7mmMISAJ8-AMRP181bK-JNnymcpC8ASE43jp2s_5AfG3np2vS0Ecuek4C-luxSttDd2vTje5RPRCFDF0DcBUeaoLCP4zjJgcfubKftH-1Psejhj9IjBgtuSEjkGPmd_Z0f15qxJF23XhcSO8GNovgzkTh";

const INITIAL_AI_MSG: Message = { 
  id: 1, 
  sender: 'bot', 
  text: "Halo! Selamat datang di Asisten Cerdas RANTU. 🌾\n\nSaya siap membantu Anda dengan informasi lengkap seputar:\n✅ Update harga pasar komoditas di Jambi\n✅ Prakiraan cuaca & rekomendasi penyiraman\n✅ Panduan budidaya & pengendalian hama\n\nSilakan pilih topik di bawah atau ketik pertanyaan Anda.", 
  time: '10:30 AM' 
};

const QUICK_QUESTIONS = [
  "Update harga cabai & bawang",
  "Cuaca Jambi hari ini",
  "Cara tanam cabai merah",
  "Obat hama ulat grayak",
  "Rekomendasi pupuk dasar"
];

const SELLER_QUICK_QUESTIONS = [
  "Apakah stok masih ready? 📦",
  "Bisa dikirim hari ini? 🚚",
  "Kondisi barang segar? 🌿",
  "Berapa lama tahan di suhu ruang? ⏳",
  "Ada harga grosir untuk pembelian banyak? 💰"
];

// Initial Sessions
const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'ai-assistant',
    contactName: 'RANTU AI',
    type: 'ai',
    avatar: AI_AVATAR,
    messages: [INITIAL_AI_MSG],
    lastMessage: 'Silakan pilih topik di bawah atau ketik pertanyaan Anda.',
    timestamp: 'Now'
  }
];

export const Chat: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 'ai' or 'inbox' (for seller/courier)
  const [activeTab, setActiveTab] = useState<'ai' | 'inbox'>('ai');

  // Initialize State from LocalStorage if available
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem('rantu_chat_sessions');
    return savedSessions ? JSON.parse(savedSessions) : INITIAL_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('ai-assistant');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect: Save to LocalStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('rantu_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Effect: Switch Tab based on URL param
  useEffect(() => {
    const typeParam = searchParams.get('tab');
    if (typeParam === 'inbox') {
       setActiveTab('inbox');
    } else if (typeParam === 'ai') {
       setActiveTab('ai');
    }
  }, [searchParams]);

  // Handle Navigation from Product/Order Page (Location State)
  useEffect(() => {
    if (location.state && location.state.contactName) {
      const { contactName, type } = location.state;
      
      // Force switch to inbox tab since it's a human chat
      setActiveTab('inbox');
      
      // Check if session ALREADY exists in sessions list
      const existingSession = sessions.find(s => s.contactName === contactName);
      
      if (existingSession) {
        // Resume existing chat
        if (activeSessionId !== existingSession.id) {
          setActiveSessionId(existingSession.id);
        }
      } else {
        // Create new session ONLY if it doesn't exist
        const newSessionId = `seller-${Date.now()}`;
        const newSession: ChatSession = {
          id: newSessionId,
          contactName: contactName,
          type: type || 'seller',
          avatar: SELLER_AVATAR_DEFAULT,
          messages: [{
            id: Date.now(),
            sender: 'seller', 
            text: `Halo! Ada yang bisa kami bantu terkait produk dari ${contactName}?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
          }],
          lastMessage: 'Halo! Ada yang bisa kami bantu?',
          timestamp: 'Just now'
        };
        
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSessionId);
      }
    }
  }, [location.state, sessions]); // Add sessions dependency to correctly find existing

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter(s => 
     activeTab === 'ai' ? s.type === 'ai' : s.type !== 'ai'
  );

  // If filtered sessions is empty (e.g. no seller chats yet), activeSession might be undefined
  const activeSession = sessions.find(s => s.id === activeSessionId);
  
  // Ensure we are viewing a session relevant to the current tab, otherwise select the first one
  useEffect(() => {
     if (filteredSessions.length > 0) {
        // If current active session is NOT in the filtered list (e.g. switched tabs), switch to the first one in list
        const isCurrentInList = filteredSessions.find(s => s.id === activeSessionId);
        if (!isCurrentInList) {
           setActiveSessionId(filteredSessions[0].id);
        }
     } else {
        // No sessions in this tab
        setActiveSessionId('');
     }
  }, [activeTab]); // Removed sessions to prevent flickering, relying on filteredSessions update logic

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, loading, activeTab]);

  // AI Logic 
  const getBotResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('halo') || lower.includes('hai')) {
      return "Halo juga! 👋 Semoga hari Anda menyenangkan.\n\nSaya adalah asisten virtual RANTU yang didesain khusus untuk membantu petani dan pembeli.\n\nAnda bisa menanyakan hal-hal spesifik seperti:\n• \"Berapa harga bawang merah di pasar Angso Duo?\"\n• \"Bagaimana cara mengatasi daun cabai keriting?\"\n• \"Apakah nanti sore akan hujan?\"\n\nApa yang bisa saya bantu sekarang?";
    }
    if (lower.includes('harga') || lower.includes('berapa')) {
       return "Berikut rangkuman harga rata-rata komoditas pangan di pasar Jambi hari ini:\n\n🥦 Sayuran Segar\n• Bayam/Kangkung: Rp 2.500 - 3.000 /ikat\n• Tomat Sayur: Rp 8.000 /kg\n• Wortel Berastagi: Rp 12.000 /kg\n\n🌶️ Bumbu & Rempah\n• Cabai Merah: Rp 45.000 /kg\n• Bawang Merah: Rp 32.000 /kg\n\nData diperbarui pukul 08:00 WIB. Ada komoditas lain yang ingin dicek?";
    }
    if (lower.includes('cuaca')) {
      return "🌤️ Laporan Cuaca Wilayah Jambi & Sekitarnya\n\n📅 Kondisi Saat Ini: Cerah Berawan, Suhu 31°C\n💧 Kelembapan: 70%\n\n📢 Prakiraan Lanjutan:\n• Siang: Terik dengan indeks UV tinggi.\n• Sore: Waspada potensi hujan lokal di wilayah Muaro Jambi.";
    }
    // Default fallback
    return "Maaf, saya belum memahami pertanyaan spesifik Anda sepenuhnya. 🤔\n\nCoba tanya tentang:\n• 'Harga cabai'\n• 'Cuaca hari ini'\n• 'Cara tanam padi'";
  };

  // Seller Logic (Updated with simple keyword matching)
  const getSellerResponse = (text: string) => {
    const lower = text.toLowerCase();
    
    if (lower.includes('stok') || lower.includes('ready') || lower.includes('ada')) {
      return "Halo kak! Stok saat ini masih ready banyak ya. Silakan langsung diorder sebelum kehabisan. 🌱";
    }
    
    if (lower.includes('kirim') || lower.includes('kapan') || lower.includes('antar') || lower.includes('sampai')) {
      return "Pengiriman dilakukan setiap hari. Pesanan sebelum jam 14.00 WIB akan dikirim di hari yang sama. Untuk dalam kota Jambi bisa pakai Instan ya kak. 🚚";
    }
    
    if (lower.includes('harga') || lower.includes('diskon') || lower.includes('kurang') || lower.includes('murah') || lower.includes('mahal') || lower.includes('grosir')) {
      return "Harga yang tertera sudah harga terbaik untuk kualitas Grade A langsung dari petani kak. Untuk pembelian grosir >10kg ada harga khusus, silakan ajukan penawaran. 💰";
    }
    
    if (lower.includes('segar') || lower.includes('fresh') || lower.includes('layu') || lower.includes('bagus') || lower.includes('kondisi')) {
      return "Tenang kak, semua sayur & buah kami dipanen subuh tadi. Dijamin sampai di tangan kakak masih segar dan tidak layu. Garansi uang kembali jika rusak. 🌿";
    }
    
    if (lower.includes('tahan') || lower.includes('awet') || lower.includes('lama')) {
      return "Produk ini bisa tahan 2-3 hari di suhu ruang yang sejuk. Kalau masuk kulkas bisa tahan sampai 1 minggu lebih kak. ❄️";
    }

    const responses = [
      "Halo kak, terima kasih sudah mampir. Ada yang bisa kami bantu jelaskan lagi tentang produknya? 😊",
      "Iya kak, benar sekali. Silakan ditanyakan jika masih ada yang kurang jelas ya. 🙏",
      "Baik kak, ditunggu orderannya ya! Semoga cocok dengan produk hasil panen kami."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = (text: string = input) => {
    if (!text.trim() || !activeSessionId) return;
    
    const userMsg: Message = { 
      id: Date.now(), 
      sender: 'user', 
      text: text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) 
    };
    
    // Add user message
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
      ? { ...s, messages: [...s.messages, userMsg], lastMessage: text, timestamp: 'Now' } 
      : s
    ));
    
    setInput('');
    setLoading(true);

    // Determine Response Type
    setTimeout(() => {
       const currentSession = sessions.find(s => s.id === activeSessionId);
       // Safety check: if session was deleted or user switched too fast
       if (!currentSession) return;

       const isAI = currentSession.type === 'ai';
       const responseText = isAI ? getBotResponse(userMsg.text) : getSellerResponse(userMsg.text);
       const senderType = isAI ? 'bot' : 'seller';

       const botMsg: Message = { 
         id: Date.now() + 1, 
         sender: senderType, 
         text: responseText, 
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) 
       };
       
       setSessions(prev => prev.map(s => 
          s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, botMsg], lastMessage: responseText, timestamp: 'Now' } 
          : s
       ));
       setLoading(false);
    }, 1500);
  };

  const handleNewAIChat = () => {
     const newId = `ai-${Date.now()}`;
     const newSession: ChatSession = {
       id: newId,
       contactName: 'RANTU AI',
       type: 'ai',
       avatar: AI_AVATAR,
       messages: [INITIAL_AI_MSG],
       lastMessage: 'Percakapan baru dimulai.',
       timestamp: 'Now'
     };
     setSessions(prev => [newSession, ...prev]);
     setActiveSessionId(newId);
     setActiveTab('ai'); // Ensure we switch to AI tab
  };

  const getSuggestions = (session: ChatSession | undefined) => {
    if (!session) return [];
    if (session.type === 'ai') return QUICK_QUESTIONS;
    if (session.type === 'seller') return SELLER_QUICK_QUESTIONS;
    return [];
  };

  const currentSuggestions = getSuggestions(activeSession);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
       {/* Sidebar */}
       <aside className="w-80 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
             <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-4 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
             >
                Asisten AI
             </button>
             <button 
                onClick={() => setActiveTab('inbox')}
                className={`flex-1 py-4 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'inbox' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
             >
                Pesan
             </button>
          </div>

          {activeTab === 'ai' && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
               <button 
                  onClick={handleNewAIChat}
                  className="w-full bg-primary text-[#111813] font-bold py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
               >
                 <span className="material-symbols-outlined">add</span>
                 Tanya AI Baru
               </button>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-2">
             {filteredSessions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                   <p className="text-sm">Belum ada percakapan.</p>
                   {activeTab === 'inbox' && <p className="text-xs mt-2">Chat dengan penjual dari halaman produk.</p>}
                </div>
             ) : (
                filteredSessions.map((session) => (
                  <div 
                    key={session.id} 
                    onClick={() => setActiveSessionId(session.id)}
                    className={`p-3 rounded-lg mx-2 mb-1 cursor-pointer transition-colors flex items-center gap-3 ${session.id === activeSessionId ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}`}
                  >
                     <div className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0 relative" style={{ backgroundImage: `url("${session.avatar || SELLER_AVATAR_DEFAULT}")`}}>
                        {session.type === 'ai' && (
                           <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-surface-dark">
                              <span className="material-symbols-outlined text-[10px] text-white block">smart_toy</span>
                           </div>
                        )}
                     </div>
                     <div className="flex-1 overflow-hidden">
                         <div className="flex justify-between items-center">
                           <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{session.contactName}</p>
                           <span className="text-[10px] text-gray-400">{session.timestamp}</span>
                         </div>
                         <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{session.lastMessage}</p>
                     </div>
                  </div>
                ))
             )}
          </div>
       </aside>

       {/* Chat Area */}
       <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative">
          
          {/* Mobile Tab Switcher (Visible only on mobile) */}
          <div className="md:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark">
             <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
             >
                Asisten AI
             </button>
             <button 
                onClick={() => setActiveTab('inbox')}
                className={`flex-1 py-3 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'inbox' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
             >
                Pesan
             </button>
          </div>

          {activeSession ? (
             <>
                {/* Mobile Header */}
                <div className="md:hidden p-3 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${activeSession.avatar}")`}}></div>
                   <span className="font-bold text-gray-900 dark:text-white">{activeSession.contactName}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-40">
                   {activeSession.messages.map(msg => (
                     <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender !== 'user' && (
                          <div className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url("${activeSession.avatar}")`}}></div>
                        )}
                        
                        <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-2xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                           <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900 dark:text-white">
                                 {msg.sender === 'user' ? 'Anda' : activeSession.contactName}
                              </span>
                              <span className="text-xs text-gray-500">{msg.time}</span>
                           </div>
                           <div className={`p-4 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-primary text-[#111813] font-medium rounded-tr-none' : 'bg-white dark:bg-surface-dark rounded-tl-none border border-gray-200 dark:border-gray-700'}`}>
                              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                           </div>
                        </div>

                        {msg.sender === 'user' && (
                           <div className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARFoELmD8OCM5vGjYGkmUlrB9UkeeoBPFjMJ-442x4SbFa8HZxjsdMXkQGopOf5GHdlyH7r8uObEIqeTACrg3-kLS5MTM2pOvohyCoYfAenopZY7iH7r1hW9xFHT7pB5-SzdWXEoIsT--zSXqS0COV97ektJ1Nxzaj3s9xs1jZnvo-EDO1jIt95VF_gFQJnyDMG679zwW4wfT7ONK4EidSM-D6yGAXtEYsmmoMZHhVDp-_IJCd0LvV0QEYSUGYWdyIbEshaUp4LpmY")'}}></div>
                        )}
                     </div>
                   ))}
                   {loading && (
                     <div className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url("${activeSession.avatar}")`}}></div>
                        <div className="flex items-center">
                          <div className="text-gray-500 text-sm italic bg-white dark:bg-surface-dark px-4 py-2 rounded-xl rounded-tl-none border border-gray-200 dark:border-gray-700">Sedang mengetik...</div>
                        </div>
                     </div>
                   )}
                   <div ref={messagesEndRef} />
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 p-4">
                   <div className="max-w-4xl mx-auto flex flex-col gap-3">
                      {/* Quick Questions Suggestions */}
                      {currentSuggestions.length > 0 && (
                         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {currentSuggestions.map((q, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => handleSend(q)}
                                 className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary dark:hover:text-primary bg-gray-50 dark:bg-background-dark text-gray-600 dark:text-gray-300 text-xs font-bold transition-all"
                               >
                                  {q}
                               </button>
                            ))}
                         </div>
                      )}

                      <div className="relative">
                         <input 
                           type="text" 
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                           placeholder={activeSession.type === 'ai' ? "Tanya RANTU AI..." : `Kirim pesan ke ${activeSession.contactName}...`}
                           className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary text-gray-900 dark:text-white shadow-sm"
                         />
                         <button 
                           onClick={() => handleSend()} 
                           disabled={!input.trim() || loading}
                           className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-primary text-[#111813] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            <span className="material-symbols-outlined text-xl">send</span>
                         </button>
                      </div>
                   </div>
                </div>
             </>
          ) : (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
               <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">forum</span>
               <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Tidak ada percakapan aktif</h3>
               <p className="max-w-xs">
                  {activeTab === 'ai' 
                     ? "Mulai percakapan baru dengan AI untuk bantuan pertanian." 
                     : "Hubungi penjual dari halaman produk untuk memulai chat."}
               </p>
               {activeTab === 'ai' && (
                  <button onClick={handleNewAIChat} className="mt-6 bg-primary text-[#111813] font-bold px-6 py-3 rounded-lg hover:bg-primary-dark">
                     Mulai Chat AI
                  </button>
               )}
            </div>
          )}
       </div>
    </div>
  );
};
