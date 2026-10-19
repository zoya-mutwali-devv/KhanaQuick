import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== "student") {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get("/cart");
      const list = data.cart?.items ?? data.items ?? [];
      setItems(list.filter((i) => i.food));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1) => {
    try {
      await api.post("/cart/add", { foodId, quantity });
      await fetchCart();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  const updateQty = async (foodId, quantity) => {
    try {
      await api.put(`/cart/item/${foodId}`, { quantity });
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update cart");
    }
  };

  const removeItem = async (foodId) => {
    try {
      await api.delete(`/cart/item/${foodId}`);
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
    } catch {
      /* ignore */
    }
    setItems([]);
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, total, loading, fetchCart, addToCart, updateQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);