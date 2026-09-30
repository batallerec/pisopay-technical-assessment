import { createContext, useCallback, useContext, useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }, []);

  const toast = useCallback((toastData) => {
    const toastId = crypto.randomUUID();

    setToasts((currentToasts) => [...currentToasts, { ...toastData, id: toastId }]);

    return toastId;
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismissToast, toasts }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}

function ToastViewport() {
  const { toasts } = useToast();

  return (
    <ToastPrimitive.Viewport className="fixed right-0 top-0 z-[100] flex w-full max-w-sm flex-col gap-3 p-4 outline-none sm:right-4 sm:top-4" aria-label="Notifications">
      {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />)}
    </ToastPrimitive.Viewport>
  );
}

function ToastItem({ toast }) {
  const { dismissToast } = useToast();

  return (
    <ToastPrimitive.Root
      defaultOpen
      duration={4000}
      onOpenChange={(open) => {
        if (!open) {
          dismissToast(toast.id);
        }
      }}
      className="group relative rounded-2xl border border-[#a9c5b0] bg-white p-4 pr-10 text-[#173c2e] shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in"
    >
      <ToastPrimitive.Title className="text-sm font-bold text-[#3b8058]">{toast.title}</ToastPrimitive.Title>
      {toast.description && (
        <ToastPrimitive.Description className="mt-1 text-sm leading-5 text-[#68776d]">
          {toast.description}
        </ToastPrimitive.Description>
      )}
      <ToastPrimitive.Close className="absolute right-3 top-3 cursor-pointer rounded-md px-1 text-lg leading-none text-[#718077] hover:bg-[#eef3ed] hover:text-[#173c2e]" aria-label="Close notification">
        &times;
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}