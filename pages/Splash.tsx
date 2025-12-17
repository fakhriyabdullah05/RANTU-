import React from 'react';

export const Splash: React.FC = () => {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden items-center justify-center">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 dark:opacity-10" 
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDf9bYwq4eCQ3lriIlPdHo-Za2OJFBZBi4Wsyim6P1nbwyr_KMBJ-1RessQ9sp0wWeoRlW8UviF6e_hYzU1caVz9HopwxmM8gqYK6hZ2jz6PyfZMaBQeEZZ2foA-3PUzICk_UtyH8OHelNN75hQ-n8CwZ1lTDFuGNkSSLCxAlo7qrMlF6ger-VWQ5vGVa2ULc9dO4AATNMCEAVKtcvpuL6pwz2X0W85PiD6Vex-6AvCeOFmq5JT5UGQWVyDLt8P7ZnjKwEqa1dBxEBl")'}}
      ></div>
      
      <div className="relative z-10 flex flex-col items-center gap-8 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center p-6 bg-primary/20 dark:bg-primary/30 rounded-full">
            <span className="material-symbols-outlined text-primary text-6xl">eco</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#111813] dark:text-white">RANTU</h1>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[#111813] dark:text-gray-200 text-2xl font-bold text-center max-w-md">
            Fresh from the Farm, Powered by AI.
          </h2>
          
          <div className="w-64 flex flex-col gap-2">
             <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 rounded-full animate-[loading_1s_ease-in-out_infinite]"></div>
             </div>
             <p className="text-center text-sm text-gray-500">Loading application...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
