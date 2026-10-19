import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  TicketPercent,
  ShoppingBag,
  CreditCard,
  CalendarClock,
  UtensilsCrossed,
  ArrowRight,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [pickupTime, setPickupTime] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [applied, setApplied] = useState(null);
  const [checking, setChecking] = useState(false);

  // Order placed successfully
  if (placedOrder) {
    return (
      <div className="max-w-md mx-auto py-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100 border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center px-6 py-8">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={38} />
            </div>
            <h1 className="text-2xl font-extrabold">Order placed!</h1>
            <p className="text-green-50 text-sm mt-2">
              Your order has been placed successfully.
            </p>
          </div>

          <div className="p-6">
            <p className="text-center text-sm text-gray-500 mb-3">
              Show this token at the counter
            </p>

            <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-2xl py-5 px-4 mb-5 text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-orange-500 mb-2">
                YOUR TOKEN
              </p>
              <p className="text-3xl font-extrabold text-orange-600 tracking-wider break-words">
                {placedOrder.tokenNumber}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-3 mb-6">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Total amount</span>
                <b className="text-gray-900">
                  ₹{placedOrder.totalAmount}
                </b>
              </div>

              {placedOrder.discount > 0 && (
                <div className="flex justify-between gap-3 text-green-600">
                  <span>Discount</span>
                  <span>₹{placedOrder.discount}</span>
                </div>
              )}

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium text-gray-800">
                  {placedOrder.paymentMethod} · Pay at counter
                </span>
              </div>

              {placedOrder.pickupTime && (
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Pickup</span>
                  <span className="font-medium text-gray-800 text-right">
                    {new Date(placedOrder.pickupTime).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/orders"
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 transition-all"
              >
                Track order <ArrowRight size={17} />
              </Link>

              <Link
                to="/"
                className="flex-1 flex items-center justify-center border border-orange-200 text-orange-700 hover:bg-orange-50 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                Back to menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Enter a coupon code");

    setChecking(true);

    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponCode.trim(),
        subtotal: total,
      });

      setApplied(data);
      toast.success(`${data.code} applied`);
    } catch (err) {
      setApplied(null);
      toast.error(err.response?.data?.message || "Could not apply coupon");
    } finally {
      setChecking(false);
    }
  };

  const removeCoupon = () => {
    setApplied(null);
    setCouponCode("");
  };

  const placeOrder = async () => {
    setPlacing(true);

    try {
      const payload = {
        items: items.map((i) => ({
          food: i.food._id,
          quantity: i.quantity,
        })),
        paymentMethod,
      };

      if (applied) payload.couponCode = applied.code;

      if (pickupTime) {
        payload.pickupTime = new Date(pickupTime).toISOString();
      }

      const { data } = await api.post("/orders", payload);

      await clearCart();
      setPlacedOrder(data.order);
      toast.success("Order placed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  const payBtn = (value) =>
    `flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition-all duration-200 ${
      paymentMethod === value
        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
        : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
    }`;

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Page heading */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-2xl text-orange-600">
            <ShoppingBag size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Checkout
            </h1>
            <p className="text-sm text-gray-500">
              Almost there! Review your order.
            </p>
          </div>
        </div>

        <div className="h-1.5 bg-orange-100 rounded-full mt-5 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
        </div>
      </div>

      {/* Pickup time */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-xl text-orange-500">
            <CalendarClock size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Pickup time</h2>
            <p className="text-xs text-gray-500">Optional · Pre-order</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Leave empty to pick up as soon as your order is ready.
        </p>

        <input
          type="datetime-local"
          value={pickupTime}
          min={new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16)}
          onChange={(e) => setPickupTime(e.target.value)}
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
        />
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-xl text-orange-500">
              <UtensilsCrossed size={21} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Order summary</h2>
              <p className="text-xs text-gray-500">
                {items.length} {items.length === 1 ? "item" : "items"} in your order
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {items.map(({ food, quantity }) => (
            <div
              key={food._id}
              className="flex items-center justify-between gap-3 py-2 border-b border-dashed border-gray-100 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 break-words">
                  {food.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ₹{food.price} × {quantity}
                </p>
              </div>

              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                ₹{food.price * quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          {applied && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({applied.code})</span>
              <span className="font-semibold">− ₹{applied.discount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4 mt-4">
          <div>
            <p className="text-sm font-bold text-gray-800">Total amount</p>
            <p className="text-xs text-gray-500 mt-1">Pay at the counter</p>
          </div>

          <span className="text-2xl font-extrabold text-orange-600 whitespace-nowrap">
            ₹{applied ? applied.total : total}
          </span>
        </div>
      </div>

      {/* Coupon */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-xl text-green-600">
            <TicketPercent size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Coupon code</h2>
            <p className="text-xs text-gray-500">
              Have a coupon? Save on your order.
            </p>
          </div>
        </div>

        {applied ? (
          <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Check size={18} className="text-green-600 shrink-0" />

              <div className="min-w-0">
                <p className="text-sm text-green-700 font-bold break-words">
                  {applied.code}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {applied.discountPercent}% discount applied
                </p>
              </div>
            </div>

            <button
              onClick={removeCoupon}
              className="text-sm text-red-600 hover:text-red-700 font-semibold shrink-0"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="min-w-0 flex-1 border border-gray-200 bg-gray-50 rounded-xl px-3 py-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all placeholder:normal-case"
            />

            <button
              onClick={applyCoupon}
              disabled={checking}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-xl font-semibold text-sm shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking ? "Checking..." : "Apply"}
            </button>
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-xl text-orange-500">
            <CreditCard size={21} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Payment method</h2>
            <p className="text-xs text-gray-500">
              Payment is collected at the counter.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={payBtn("Cash")}
          >
            Cash
            {paymentMethod === "Cash" && <CheckCircle2 size={17} />}
          </button>

          <button
            onClick={() => setPaymentMethod("UPI")}
            className={payBtn("UPI")}
          >
            UPI
            {paymentMethod === "UPI" && <CheckCircle2 size={17} />}
          </button>
        </div>
      </div>

      {/* Place order */}
      <button
        onClick={placeOrder}
        disabled={placing}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-5 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {placing ? (
          <>
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Placing order...
          </>
        ) : (
          <>
            Place order · ₹{applied ? applied.total : total}
            <ArrowRight size={19} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Please review your order before placing it.
      </p>
    </div>
  );
}