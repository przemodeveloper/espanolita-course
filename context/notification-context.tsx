"use client";

import { createContext, useCallback, useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";

type NotificationVariant = "default" | "success" | "error";

type NotificationContextValue = {
  notify: (message: string, variant?: NotificationVariant) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const notify = useCallback(
    (message: string, variant: NotificationVariant = "default") => {
      if (variant === "success") {
        toast.success(message, { icon: false });
        return;
      }

      if (variant === "error") {
        toast.error(message);
        return;
      }

      toast(message);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={3000}
        closeOnClick
        style={
          {
            // Tailwind-ish colors (green-600 / red-600)
            "--toastify-color-success": "#16a34a",
            "--toastify-color-error": "#dc2626",
            "--toastify-color-progress-success": "#16a34a",
            "--toastify-color-progress-error": "#dc2626",
          } as CSSProperties
        }
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationContextProvider",
    );
  }

  return context;
};
