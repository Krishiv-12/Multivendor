import { useEffect, useState } from "react";

const Toast = ({ message, type, visible }) => {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      } ${
        type === "success"
          ? "bg-emerald-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  );
};

// Hook for using toasts easily
export const useToast = () => {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  return { toast, showToast, ToastComponent: <Toast {...toast} /> };
};

export default Toast;
