import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Receipt,
  Star,
  ShoppingBag,
  Clock,
  CalendarDays,
  CreditCard,
  UtensilsCrossed,
  PackageCheck,
} from "lucide-react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import ReviewModal from "../../components/ReviewModal";
import { useNotifications } from "../../context/NotificationContext";

const steps = ["Pending", "Preparing", "Ready", "Delivered"];

function Progress({ status }) {
  if (status === "Cancelled") return null;

  const current = steps.indexOf(status);

  return (
    <div className="my-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
        Order Progress
      </p>

      <div className="flex items-start">
        {steps.map((step, index) => {
          const completed = index <= current;

          return (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center"
            >
              <div
                className={`z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                  completed
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-gray-200 bg-white text-gray-300"
                }`}
              >
                {completed ? (
                  <PackageCheck size={14} />
                ) : (
                  <span className="text-[10px] font-bold">{index + 1}</span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-3.5 h-0.5 w-full ${
                    index < current ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              )}

              <p
                className={`mt-2 text-center text-[10px] sm:text-xs ${
                  completed
                    ? "font-bold text-orange-600"
                    : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { refreshKey } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);

  // Existing order loading and automatic refresh
  useEffect(() => {
    const load = () =>
      api
        .get("/orders")
        .then(({ data }) => setOrders(data))
        .catch(() => {})
        .finally(() => setLoading(false));

    load();

    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [refreshKey]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-[#fffaf2] to-[#ffedd8] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <ShoppingBag size={28} />
          </div>
          <p className="font-semibold text-gray-600">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffaf2] via-[#fff4e6] to-[#ffedd8] px-4 py-12">
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative w-full max-w-md rounded-[28px] border border-white bg-white/90 px-6 py-10 text-center shadow-[0_20px_60px_rgba(150,85,35,0.12)] sm:px-10">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-[#ff5c0a]">
            <ShoppingBag size={42} strokeWidth={1.6} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            My <span className="text-[#ff5c0a]">Orders</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Looks like you haven't ordered anything yet. Discover something
            delicious and place your first order!
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5c0a] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition duration-200 hover:-translate-y-0.5 hover:bg-[#ed4e00] hover:shadow-xl"
          >
            <UtensilsCrossed size={18} />
            Explore Menu
          </Link>

          <p className="mt-5 text-xs font-medium text-gray-400">
            Great food. Great mood.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-58px)] overflow-hidden bg-gradient-to-br from-[#fffaf2] via-[#fff5e9] to-[#ffedd8] px-4 py-8 sm:px-6 sm:py-12">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        {/* Page Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm">
            <ShoppingBag size={16} />
            Your Orders
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            My <span className="text-[#ff5c0a]">Orders</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Track your orders and enjoy every bite.
          </p>

          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-4 py-2 text-sm text-gray-600 shadow-sm">
            <PackageCheck size={17} className="text-orange-500" />
            <span>
              <strong className="text-gray-900">{orders.length}</strong>{" "}
              {orders.length === 1 ? "order" : "orders"} placed
            </span>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((o) => (
            <article
              key={o._id}
              className="overflow-hidden rounded-[24px] border border-white bg-white/95 shadow-[0_12px_40px_rgba(150,85,35,0.09)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(150,85,35,0.14)]"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/90 to-amber-50/60 px-5 py-5 sm:px-7">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#ff5c0a] shadow-sm">
                    <Receipt size={23} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Order Token
                    </p>

                    <p className="mt-1 break-words text-2xl font-black text-[#ff5c0a]">
                      #{o.tokenNumber}
                    </p>

                    <p className="mt-1 flex items-start gap-1.5 text-xs text-gray-500">
                      <CalendarDays
                        size={14}
                        className="mt-0.5 shrink-0"
                      />
                      <span>{new Date(o.createdAt).toLocaleString()}</span>
                    </p>

                    {o.pickupTime && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-blue-600">
                        <Clock size={14} className="mt-0.5 shrink-0" />
                        <span>
                          Pickup: {new Date(o.pickupTime).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={o.status} />
                </div>
              </div>

              {/* Order Progress */}
              <div className="px-5 pt-4 sm:px-7">
                <Progress status={o.status} />
              </div>

              {/* Ordered Items */}
              <div className="px-5 py-4 sm:px-7">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <UtensilsCrossed size={17} />
                  </div>

                  <h2 className="font-bold text-gray-800">
                    Order Items
                  </h2>
                </div>

                <div className="space-y-3">
                  {o.items.map((i) => (
                    <div
                      key={i.food}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-gray-700">
                          {i.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Quantity: {i.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-bold text-gray-800">
                        ₹{i.subtotal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Payment */}
              <div className="mx-5 border-t border-dashed border-orange-200 sm:mx-7" />

              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Total Amount
                  </p>

                  <p className="mt-1 text-2xl font-black text-gray-900">
                    ₹{o.totalAmount}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <CreditCard size={14} className="text-orange-500" />
                    <span>{o.paymentMethod}</span>
                    <span className="text-gray-300">•</span>
                    <span>Payment: {o.paymentStatus}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <Link
                    to={`/orders/${o._id}/bill`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-600 transition hover:border-orange-400 hover:bg-orange-50 sm:flex-none"
                  >
                    <Receipt size={17} />
                    View Bill
                  </Link>

                  {o.status === "Delivered" && (
                    <button
                      onClick={() => setReviewOrder(o)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff5c0a] px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-[#ed4e00] sm:flex-none"
                    >
                      <Star size={17} />
                      Rate Order
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Browse More */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white/80 px-5 py-3 text-sm font-bold text-orange-600 transition hover:border-orange-400 hover:bg-white"
          >
            <UtensilsCrossed size={17} />
            Order Something Delicious
          </Link>
        </div>
      </div>

      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
        />
      )}
    </main>
  );
}