import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, variant = 'success') => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setToast({ message, variant });
    timerRef.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[400] max-w-sm px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold text-white ${
            toast.variant === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { showToast: () => {} };
  return ctx;
}
