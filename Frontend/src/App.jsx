import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/student/Menu";
import Cart from "./pages/student/Cart";
import Checkout from "./pages/student/Checkout";
import MyOrders from "./pages/student/MyOrders";
import Bill from "./pages/student/Bill";
import Profile from "./pages/student/Profile";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Foods from "./pages/admin/Foods";
import Categories from "./pages/admin/Categories";
import Inventory from "./pages/admin/Inventory";
import Coupons from "./pages/admin/Coupons";

export default function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-orange-50">
      <Toaster position="top-center" />
{!hideNavbar && <Navbar />}
      <div
  className={
    location.pathname === "/login" ||
    location.pathname === "/register"
      ? "w-full"
      : "w-full max-w-[1350px] mx-auto px-5 py-3"
  }
>
  <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute roles={["student"]}><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute roles={["student"]}><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={["student"]}><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id/bill" element={<ProtectedRoute><Bill /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin / staff routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "staff"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="foods" element={<Foods />} />
            <Route path="categories" element={<Categories />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="coupons" element={<Coupons />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}