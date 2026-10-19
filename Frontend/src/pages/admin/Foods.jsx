import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, X, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const empty = {
  name: "",
  category: "",
  price: "",
  stock: "",
  lowStockThreshold: 5,
  description: "",
  image: "",
};

export default function Foods() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    api
      .get("/foods")
      .then(({ data }) => setFoods(data))
      .catch(() => {});

  useEffect(() => {
    load();
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  const close = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(false);
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      lowStockThreshold: Number(form.lowStockThreshold || 5),
    };

    try {
      if (editId) {
        await api.put(`/foods/${editId}`, payload);
        toast.success("Food updated");
      } else {
        await api.post("/foods", payload);
        toast.success("Food added");
      }

      close();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const edit = (f) => {
    setEditId(f._id);
    setForm({
      name: f.name,
      category: f.category?._id || "",
      price: f.price,
      stock: f.stock,
      lowStockThreshold: f.lowStockThreshold,
      description: f.description || "",
      image: f.image || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this food item?")) return;

    try {
      await api.delete(`/foods/${id}`);
      toast.success("Food deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete");
    }
  };

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const input =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 p-5 text-white shadow-lg shadow-orange-200/50 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-100">
            <UtensilsCrossed size={17} />
            <span>Menu Management</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Foods
          </h1>

          <p className="mt-1.5 text-sm text-orange-50">
            Manage food items, prices and stock.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 sm:self-center"
          >
            <Plus size={18} />
            Add Food
          </button>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <form
          onSubmit={submit}
          className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-orange-100 bg-orange-50/70 px-5 py-4">
            <div>
              <h2 className="font-bold text-gray-900">
                {editId ? "Edit Food Item" : "Add New Food"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Enter the food item's details below.
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-gray-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Food Name
              </label>
              <input
                className={input}
                placeholder="Enter food name"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                className={input}
                value={form.category}
                onChange={set("category")}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Price (₹)
              </label>
              <input
                className={input}
                type="number"
                min="0"
                placeholder="Enter price"
                value={form.price}
                onChange={set("price")}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Stock Quantity
              </label>
              <input
                className={input}
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                value={form.stock}
                onChange={set("stock")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Low Stock Alert At
              </label>
              <input
                className={input}
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={form.lowStockThreshold}
                onChange={set("lowStockThreshold")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Image URL <span className="font-normal text-gray-400">(Optional)</span>
              </label>
              <input
                className={input}
                placeholder="Paste image URL"
                value={form.image}
                onChange={set("image")}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Description{" "}
                <span className="font-normal text-gray-400">(Optional)</span>
              </label>
              <textarea
                className={input}
                rows={3}
                placeholder="Describe this food item..."
                value={form.description}
                onChange={set("description")}
              />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4 sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                {editId ? <Pencil size={16} /> : <Plus size={17} />}
                {editId ? "Update Food" : "Save Food"}
              </button>

              <button
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Food table */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-900">Food Items</h2>
            <p className="mt-1 text-xs text-gray-500">
              Manage your existing menu items.
            </p>
          </div>

          <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
            {foods.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-orange-50/80 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="whitespace-nowrap px-5 py-4 font-bold">
                  Food Item
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">
                  Category
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">
                  Price
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-bold">
                  Stock
                </th>
                <th className="px-5 py-4 text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {foods.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-400">
                      <UtensilsCrossed size={24} />
                    </div>
                    <p className="mt-3 font-semibold text-gray-700">
                      No food items yet
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Add a food item to get started.
                    </p>
                  </td>
                </tr>
              )}

              {foods.map((f) => {
                const isLow = f.stock <= f.lowStockThreshold;

                return (
                  <tr
                    key={f._id}
                    className="transition-colors hover:bg-orange-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {f.image ? (
                          <img
                            src={f.image}
                            alt={f.name}
                            className="h-11 w-11 shrink-0 rounded-xl border border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <UtensilsCrossed size={19} />
                          </div>
                        )}

                        <span className="min-w-[100px] font-semibold text-gray-800">
                          {f.name}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600">
                        {f.category?.name || "-"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-bold text-gray-800">
                      ₹{Number(f.price).toLocaleString("en-IN")}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                          isLow
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isLow ? "bg-red-500" : "bg-green-500"
                          }`}
                        />
                        {f.stock}
                        {isLow && " · Low"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => edit(f)}
                          title="Edit food"
                          aria-label={`Edit ${f.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-100 bg-white text-orange-600 transition hover:bg-orange-100"
                        >
                          <Pencil size={16} />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => remove(f._id)}
                            title="Delete food"
                            aria-label={`Delete ${f.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}