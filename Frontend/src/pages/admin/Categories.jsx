import { useEffect, useState } from "react";
import {
  Trash2,
  Pencil,
  Plus,
  X,
  Tags,
  FolderOpen,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Categories() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  const load = () =>
    api
      .get("/categories")
      .then(({ data }) => setList(data))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setForm({ name: "", description: "" });
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/categories", form);
        toast.success("Category added");
      }

      reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const edit = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name,
      description: c.description || "",
    });
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete");
    }
  };

  const input =
    "w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Tags size={25} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold">
                Categories
              </h1>
            </div>

            <p className="text-sm text-white/90">
              Organize your food items into categories.
            </p>
          </div>

          <div className="bg-white/20 rounded-xl px-5 py-3 flex items-center gap-3 self-start sm:self-auto">
            <FolderOpen size={24} />

            <div>
              <p className="text-2xl font-bold">{list.length}</p>
              <p className="text-xs text-white/90">Total Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl">
            {editId ? <Pencil size={20} /> : <Plus size={20} />}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {editId ? "Edit Category" : "Add New Category"}
            </h2>

            <p className="text-sm text-gray-500">
              {editId
                ? "Update the category details below."
                : "Enter the details to create a new category."}
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_auto_auto] gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>

            <input
              className={input}
              placeholder="e.g. Snacks"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-gray-400 font-normal"> (Optional)</span>
            </label>

            <input
              className={input}
              placeholder="Enter category description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-medium text-sm transition shadow-sm"
          >
            {editId ? <Pencil size={17} /> : <Plus size={18} />}

            {editId ? "Update" : "Add Category"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={reset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 text-gray-600 px-4 py-3 rounded-xl text-sm transition"
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              All Categories
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your existing categories.
            </p>
          </div>

          <div className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-sm font-semibold">
            {list.length} {list.length === 1 ? "Category" : "Categories"}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="bg-orange-50 text-orange-500 rounded-2xl p-4 inline-flex mb-4">
              <FolderOpen size={32} />
            </div>

            <h3 className="font-semibold text-gray-800 mb-1">
              No categories yet
            </h3>

            <p className="text-sm text-gray-500">
              Add your first category using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.map((c) => (
              <div
                key={c._id}
                className="p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-orange-50/40 transition"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-xl shrink-0">
                    <Package size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 break-words">
                      {c.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {c.description || "No description provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => edit(c)}
                    title="Edit category"
                    aria-label={`Edit ${c.name}`}
                    className="p-2.5 rounded-xl border border-orange-100 text-orange-600 hover:bg-orange-100 transition"
                  >
                    <Pencil size={17} />
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => remove(c._id)}
                      title="Delete category"
                      aria-label={`Delete ${c.name}`}
                      className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}