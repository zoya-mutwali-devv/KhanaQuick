import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "student") {
      setNotifications([]);
      setUnread(0);
      return;
    }

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
  auth: { token: localStorage.getItem("token") },
});

    socket.on("orderStatusUpdated", (data) => {
      const notification = {
        ...data,
        time: new Date().toISOString(),
        id: `${Date.now()}-${Math.random()}`,
        read: false,
      };

      setNotifications((prev) => [notification, ...prev].slice(0, 20));

      setUnread((n) => n + 1);
      setRefreshKey((k) => k + 1);

      toast(data.message, {
        icon: "🔔",
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAllRead = () => {
    setUnread(0);

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread,
        refreshKey,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);