"use client";

import React, { useState, useEffect } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const bgColor = {
    success: "bg-success-50 dark:bg-success-950",
    error: "bg-danger-50 dark:bg-danger-950",
    info: "bg-info-50 dark:bg-info-950",
    warning: "bg-warning-50 dark:bg-warning-950",
  };

  const borderColor = {
    success: "border-success-200 dark:border-success-800",
    error: "border-danger-200 dark:border-danger-800",
    info: "border-info-200 dark:border-info-800",
    warning: "border-warning-200 dark:border-warning-800",
  };

  const textColor = {
    success: "text-success-600 dark:text-success-400",
    error: "text-danger-600 dark:text-danger-400",
    info: "text-info-600 dark:text-info-400",
    warning: "text-warning-600 dark:text-warning-400",
  };

  const iconColor = {
    success: "text-success-600 dark:text-success-400",
    error: "text-danger-600 dark:text-danger-400",
    info: "text-info-600 dark:text-info-400",
    warning: "text-warning-600 dark:text-warning-400",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`${bgColor[type]} ${borderColor[type]} border rounded-md p-[15px] flex items-start gap-[10px] animate-in slide-in-from-top`}
    >
      <span className={`${iconColor[type]} text-lg font-bold flex-shrink-0`}>{icons[type]}</span>
      <p className={`${textColor[type]} text-sm flex-1`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${textColor[type]} hover:opacity-70 flex-shrink-0 text-lg font-bold`}
      >
        ✕
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-[20px] right-[20px] z-50 space-y-[10px] max-w-[400px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
