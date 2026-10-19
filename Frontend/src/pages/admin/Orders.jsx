import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  CalendarClock,
  RefreshCw,
  Package,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

const tabs = [
  "All",
  "Pending",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

const nextStatus = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Delivered",
};

const tabIcons = {
  All: ClipboardList,
  Pending: Clock,
  Preparing: RefreshCw,
  Ready: CheckCircle2,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-extrabold text-gray-900">
          {value}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={22} />
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "orange",
}) {
  const variants = {
    orange:
      "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-100",
    green:
      "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
    red:
      "border border-red-200 bg-white text-red-600 hover:bg-red-50",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () =>
    api
      .get("/orders", {
        params: tab !== "All" ? { status: tab } : {},
      })
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));

  // Auto-refresh every 8 seconds
  useEffect(() => {
    setLoading(true);
    load();

    const id = setInterval(load, 8000);

    return () => clearInterval(id);
  }, [tab]);

  const changeStatus = async (id, status) => {
    if (
      status === "Cancelled" &&
      !confirm("Cancel this order? Stock will be restored.")
    ) {
      return;
    }

    setBusyId(id);

    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Order marked ${status}`);
      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not update status"
      );
    } finally {
      setBusyId(null);
    }
  };

  const markPaid = async (id) => {
    setBusyId(id);

    try {
      await api.patch(`/orders/${id}/pay`);
      toast.success("Payment recorded");
      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not record payment"
      );
    } finally {
      setBusyId(null);
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;
  const preparingOrders = orders.filter(
    (o) => o.status === "Preparing"
  ).length;
  const readyOrders = orders.filter(
    (o) => o.status === "Ready"
  ).length;

  return (
    <div className="min-h-full space-y-6 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 p-6 text-white shadow-lg shadow-orange-200/60 sm:p-7">
        <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 right-28 h-32 w-32 rounded-full bg-white/10" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-100">
              <ShoppingBag size={17} />
              <span>Order Management</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-orange-50">
              Manage incoming orders, track preparation and update payment
              status.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-white/20 bg-white/15 px-4 py-3 sm:self-center">
            <RefreshCw size={17} />
            <span className="text-sm font-semibold">
              Auto-refresh: 8 sec
            </span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-gray-900">
            Order Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Summary of the currently selected orders.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Orders Shown"
            value={totalOrders}
            icon={ClipboardList}
            color="bg-orange-100 text-orange-600"
          />

          <SummaryCard
            label="Pending"
            value={pendingOrders}
            icon={Clock}
            color="bg-amber-100 text-amber-700"
          />

          <SummaryCard
            label="Preparing"
            value={preparingOrders}
            icon={RefreshCw}
            color="bg-blue-100 text-blue-700"
          />

          <SummaryCard
            label="Ready for Pickup"
            value={readyOrders}
            icon={CheckCircle2}
            color="bg-green-100 text-green-700"
          />
        </div>
      </section>

      {/* Order filters */}
      <section className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900">All Orders</h2>
            <p className="mt-1 text-xs text-gray-500">
              Filter orders by their current status.
            </p>
          </div>

          <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
            {orders.length} orders
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const Icon = tabIcons[t];
            const active = tab === t;

            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-100"
                    : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Icon size={16} />
                {t}
              </button>
            );
          })}
        </div>
      </section>

      {/* Orders list */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {tab === "All" ? "Recent Orders" : `${tab} Orders`}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review order details and take action.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-orange-100 bg-white py-16 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
              <ClipboardList size={30} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-800">
              No orders found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              There are no orders in this category right now. Choose another
              status to view orders.
            </p>

            {tab !== "All" && (
              <button
                onClick={() => setTab("All")}
                className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="overflow-hidden rounded-2xl border border-orange-100/80 bg-white shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-md"
              >
                {/* Order header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/80 to-white p-4 sm:flex-row sm:items-start sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <ClipboardList size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words text-lg font-extrabold text-orange-600">
                        {o.tokenNumber}
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                        {o.user?.name || "Customer"}
                      </p>

                      <p className="break-all text-xs text-gray-500">
                        {o.user?.email}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
                        <Clock size={13} />
                        <span>
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {o.pickupTime && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-blue-600">
                          <CalendarClock size={14} />
                          <span>
                            Pickup:{" "}
                            {new Date(o.pickupTime).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <StatusBadge status={o.status} />

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        o.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {o.paymentStatus === "Paid" ? "Paid" : "Payment Pending"}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Package size={17} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-gray-800">
                      Order Items
                    </h3>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                      {o.items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {o.items.map((i, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 rounded-xl bg-gray-50/80 px-3 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-orange-600 shadow-sm">
                            {i.quantity}×
                          </div>

                          <span className="break-words text-sm font-medium text-gray-700">
                            {i.name}
                          </span>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-gray-800">
                          ₹{i.subtotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total and payment */}
                  <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <CreditCard size={14} />
                        {o.paymentMethod} · Payment {o.paymentStatus}
                      </p>

                      {o.coupon?.code && (
                        <p className="mt-1.5 text-xs font-semibold text-green-700">
                          Coupon applied: {o.coupon.code}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <span className="text-sm font-semibold text-gray-600">
                        Total Amount
                      </span>

                      <span className="flex items-center text-xl font-extrabold text-gray-900">
                        <IndianRupee size={17} />
                        {Number(o.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {(o.paymentStatus === "Pending" && o.status !== "Cancelled") ||
                  nextStatus[o.status] ? (
                    <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-gray-400">
                        Available actions
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {o.paymentStatus === "Pending" &&
                          o.status !== "Cancelled" && (
                            <ActionButton
                              disabled={busyId === o._id}
                              onClick={() => markPaid(o._id)}
                              variant="green"
                            >
                              <IndianRupee size={15} />
                              Mark Paid
                            </ActionButton>
                          )}

                        {nextStatus[o.status] && (
                          <ActionButton
                            disabled={busyId === o._id}
                            onClick={() =>
                              changeStatus(o._id, nextStatus[o.status])
                            }
                          >
                            {busyId === o._id ? (
                              "Updating..."
                            ) : (
                              <>
                                Mark {nextStatus[o.status]}
                                <ArrowRight size={15} />
                              </>
                            )}
                          </ActionButton>
                        )}

                        {nextStatus[o.status] && (
                          <ActionButton
                            disabled={busyId === o._id}
                            onClick={() => changeStatus(o._id, "Cancelled")}
                            variant="red"
                          >
                            <XCircle size={15} />
                            Cancel Order
                          </ActionButton>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                      <CheckCircle2 size={15} />
                      No further order actions available.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}