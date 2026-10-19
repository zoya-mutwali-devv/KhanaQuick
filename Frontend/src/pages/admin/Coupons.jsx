import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  TicketPercent,
  CalendarDays,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const empty = {
  code: "",
  discountPercent: "",
  minOrderAmount: "",
  maxDiscount: "",
  expiresAt: "",
  usageLimit: "",
};

export default function Coupons() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(empty);

  const load = () =>
    api.get("/coupons").then(({ data }) => setCoupons(data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      minOrderAmount:
        form.minOrderAmount === "" ? 0 : Number(form.minOrderAmount),
      maxDiscount:
        form.maxDiscount === "" ? null : Number(form.maxDiscount),
      expiresAt: form.expiresAt || null,
      usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
    };

    try {
      await api.post("/coupons", payload);
      toast.success("Coupon created");
      setForm(empty);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create coupon");
    }
  };

  const toggle = async (c) => {
    try {
      await api.put(`/coupons/${c._id}`, { isActive: !c.isActive });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update coupon");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this coupon?")) return;

    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete");
    }
  };

  const input =
    "w-full min-w-0 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition";

  const expired = (c) =>
    c.expiresAt && new Date(c.expiresAt) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <TicketPercent size={25} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold">
                Coupons
              </h1>
            </div>

            <p className="text-sm text-white/90">
              Manage discount offers and promotional codes.
            </p>
          </div>

          <div className="bg-white/20 rounded-xl px-5 py-3 flex items-center gap-3 self-start sm:self-auto">
            <Tag size={23} />

            <div>
              <p className="text-2xl font-bold">{coupons.length}</p>
              <p className="text-xs text-white/90">Total Coupons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Coupon Form */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl">
              <Plus size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Create Coupon
              </h2>

              <p className="text-sm text-gray-500">
                Set up a new discount offer.
              </p>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code <span className="text-red-500">*</span>
              </label>

              <input
                className={`${input} uppercase`}
                placeholder="e.g. SAVE10"
                value={form.code}
                onChange={set("code")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%) <span className="text-red-500">*</span>
              </label>

              <input
                className={input}
                type="number"
                min="1"
                max="100"
                placeholder="e.g. 10"
                value={form.discountPercent}
                onChange={set("discountPercent")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order (₹)
              </label>

              <input
                className={input}
                type="number"
                min="0"
                placeholder="Optional"
                value={form.minOrderAmount}
                onChange={set("minOrderAmount")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount (₹)
              </label>

              <input
                className={input}
                type="number"
                min="0"
                placeholder="Optional"
                value={form.maxDiscount}
                onChange={set("maxDiscount")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit
              </label>

              <input
                className={input}
                type="number"
                min="1"
                placeholder="Unlimited if empty"
                value={form.usageLimit}
                onChange={set("usageLimit")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>

              <input
                className={input}
                type="date"
                title="Expiry date"
                value={form.expiresAt}
                onChange={set("expiresAt")}
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-medium text-sm transition shadow-sm"
            >
              <Plus size={18} />
              Create Coupon
            </button>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            All Coupons
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View and manage your promotional offers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-orange-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Coupon Code</th>
                <th className="px-5 py-4 font-semibold">Discount</th>
                <th className="px-5 py-4 font-semibold whitespace-nowrap">
                  Min Order
                </th>
                <th className="px-5 py-4 font-semibold">Usage</th>
                <th className="px-5 py-4 font-semibold">Expires</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                {isAdmin && <th className="px-5 py-4"></th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-orange-50 text-orange-500 p-3 rounded-xl mb-3">
                        <TicketPercent size={28} />
                      </div>

                      <p className="font-semibold text-gray-700">
                        No coupons yet
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Your coupons will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {coupons.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-orange-50/40 transition"
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 bg-orange-50 border border-dashed border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg font-bold tracking-wide whitespace-nowrap">
                      <TicketPercent size={15} />
                      {c.code}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-bold text-gray-800">
                      {c.discountPercent}%
                    </span>

                    {c.maxDiscount != null && (
                      <p className="text-xs text-gray-500 mt-1">
                        Max ₹{c.maxDiscount}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    ₹{c.minOrderAmount}
                  </td>

                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    {c.usedCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </td>

                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={15} className="text-gray-400" />

                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString()
                        : "Never"}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {expired(c) ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Expired
                      </span>
                    ) : isAdmin ? (
                      <button
                        type="button"
                        onClick={() => toggle(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          c.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  {isAdmin && (
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => remove(c._id)}
                        title="Delete coupon"
                        aria-label={`Delete coupon ${c.code}`}
                        className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}