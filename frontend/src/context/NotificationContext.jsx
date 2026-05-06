import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] animate-slide-up-fade">
          <div className={`px-8 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl flex items-center space-x-4 border-2 transition-all duration-500 ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-[#006400] to-[#008000] text-white border-emerald-400/50 shadow-emerald-500/20' 
              : 'bg-[#800020] text-[#D4AF37] border-[#D4AF37]/30 shadow-red-900/40'
          }`}>
            <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
              <iconify-icon 
                icon={notification.type === 'success' ? "lucide:sparkles" : "lucide:info"} 
                className="text-2xl animate-pulse"
              ></iconify-icon>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.15em] drop-shadow-md">
                {notification.message}
              </span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <iconify-icon icon="lucide:x" className="text-lg"></iconify-icon>
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
