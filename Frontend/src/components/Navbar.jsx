import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  UtensilsCrossed,
  Bell,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { count } = useCart();
  const { notifications, unread, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isStaff = user && ["admin", "staff"].includes(user.role);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleBell = () => {
    setOpen(!open);
    if (!open) markAllRead();
  };

  const navLinkClass =
    "flex items-center justify-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-medium text-white/95 hover:bg-white/15 hover:text-white transition-all duration-200";

  return (
    <nav className="relative z-50 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200/50 print:hidden">
      <div className="mx-auto flex w-full max-w-[1350px] items-center justify-between gap-4 px-5 py-3">

        {/* Logo */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 text-xl font-extrabold tracking-tight"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-md transition-transform duration-200 group-hover:scale-105">
            <UtensilsCrossed size={23} strokeWidth={2.5} />
          </span>

          <span className="whitespace-nowrap">
            Khana<span className="text-orange-100">Quick</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          {user ? (
            <>
              {isStaff ? (
                <Link to="/admin" className={navLinkClass}>
                  Admin Panel
                </Link>
              ) : (
                <>
                  <Link to="/orders" className={navLinkClass}>
                    My Orders
                  </Link>

                  {/* Notifications */}
                  <div className="relative flex items-center">
                    <button
                      onClick={toggleBell}
                      aria-label="Notifications"
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/15"
                    >
                      <Bell size={21} />

                      {unread > 0 && (
                        <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-orange-600 ring-2 ring-orange-500">
                          {unread}
                        </span>
                      )}
                    </button>

                    {open && (
                      <div className="absolute right-0 top-full z-50 mt-3 max-h-80 w-72 overflow-x-hidden overflow-y-auto rounded-2xl border border-orange-100 bg-white text-gray-800 shadow-2xl sm:w-80">
                        <div className="rounded-t-2xl border-b border-orange-100 bg-orange-50 px-4 py-3">
                          <p className="font-bold text-gray-900">
                            Notifications
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Your latest updates
                          </p>
                        </div>

                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-gray-500">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((n, i) => (
                            <div
                              key={i}
                              className="border-b border-gray-100 px-4 py-3 transition-colors last:border-0 hover:bg-orange-50/70"
                            >
                              <p className="text-sm text-gray-700">
                                {n.message}
                              </p>

                              <p className="mt-1.5 text-xs text-gray-400">
                                {new Date(n.time).toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    aria-label="Shopping cart"
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/15"
                  >
                    <ShoppingCart size={21} />

                    {count > 0 && (
                      <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-orange-600 ring-2 ring-orange-500">
                        {count}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Profile */}
              <Link to="/profile" className={navLinkClass}>
                <User size={18} className="shrink-0" />
                <span>Profile</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm font-semibold text-orange-600 shadow-sm transition-all duration-200 hover:bg-orange-50 hover:shadow-md"
              >
                <LogOut size={17} className="shrink-0" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>
                Login
              </Link>

              <Link
                to="/register"
                className="whitespace-nowrap rounded-xl bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition-all duration-200 hover:bg-orange-50 hover:shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}