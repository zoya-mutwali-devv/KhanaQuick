import { useEffect, useState } from "react";
import { AlertTriangle, Package, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [edits, setEdits] = useState({});
  const [onlyLow, setOnlyLow] = useState(false);

  const load = () =>
    api.get("/inventory").then(({ data }) => setItems(data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const save = async (item) => {
    const value = edits[item._id];
    const quantity = Number(value);

    if (
      value === undefined ||
      value === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return toast.error("Enter a valid whole number (0 or more)");
    }

    try {
      const { data } = await api.patch(`/inventory/${item._id}`, {
        quantity,
      });

      toast.success(
        data.lowStock
          ? `${item.name} updated (still low on stock)`
          : `${item.name} stock updated`
      );

      setEdits((e) => {
        const copy = { ...e };
        delete copy[item._id];
        return copy;
      });

      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update stock");
    }
  };

  const isLow = (i) => i.stock <= i.lowStockThreshold;
  const lowCount = items.filter(isLow).length;
  const outOfStockCount = items.filter((i) => i.stock === 0).length;
  const shown = onlyLow ? items.filter(isLow) : items;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 sm:p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Package size={25} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold">Inventory</h1>
            </div>

            <p className="text-sm text-white/90">
              Monitor stock levels and update item quantities.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-medium transition self-start sm:self-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-2">Total Items</p>
          <p className="text-3xl font-bold text-gray-800">{items.length}</p>
          <p className="text-xs text-gray-400 mt-2">Items in inventory</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-2">Low Stock Items</p>
          <p className="text-3xl font-bold text-amber-600">{lowCount}</p>
          <p className="text-xs text-gray-400 mt-2">Items needing attention</p>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-2">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600">
            {outOfStockCount}
          </p>
          <p className="text-xs text-gray-400 mt-2">Items with zero stock</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg shrink-0">
            <AlertTriangle size={20} />
          </div>

          <div>
            <p className="font-semibold text-sm">Low Stock Alert</p>
            <p className="text-sm mt-0.5">
              {lowCount} item{lowCount > 1 ? "s are" : " is"} low on stock.
              Please restock.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Stock Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View current stock and update quantities.
            </p>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer bg-orange-50 border border-orange-100 px-3 py-2.5 rounded-xl">
            <input
              type="checkbox"
              checked={onlyLow}
              onChange={(e) => setOnlyLow(e.target.checked)}
              className="accent-orange-500 w-4 h-4 cursor-pointer"
            />
            Show low stock only
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-orange-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold whitespace-nowrap">
                  Item
                </th>
                <th className="px-5 py-4 font-semibold whitespace-nowrap">
                  Category
                </th>
                <th className="px-5 py-4 font-semibold whitespace-nowrap">
                  Current Stock
                </th>
                <th className="px-5 py-4 font-semibold whitespace-nowrap">
                  Alert At
                </th>
                <th className="px-5 py-4 font-semibold whitespace-nowrap">
                  Update Stock
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {shown.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-orange-50 text-orange-500 p-3 rounded-xl mb-3">
                        <Package size={28} />
                      </div>

                      <p className="font-medium text-gray-700">
                        {onlyLow
                          ? "No low-stock items"
                          : "No inventory items found"}
                      </p>

                      <p className="text-gray-400 text-xs mt-1">
                        {onlyLow
                          ? "All items are above their stock thresholds."
                          : "Inventory items will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {shown.map((i) => (
                <tr
                  key={i._id}
                  className={`transition hover:bg-orange-50/40 ${
                    isLow(i) ? "bg-red-50/40" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                    {i.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    {i.category?.name || "-"}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-bold ${
                          i.stock === 0
                            ? "text-red-600"
                            : isLow(i)
                              ? "text-amber-600"
                              : "text-gray-800"
                        }`}
                      >
                        {i.stock}
                      </span>

                      {i.stock === 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                          Out of stock
                        </span>
                      )}

                      {i.stock > 0 && isLow(i) && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                          Low stock
                        </span>
                      )}

                      {i.stock > 0 && !isLow(i) && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          In stock
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {i.lowStockThreshold}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 min-w-[210px]">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={edits[i._id] ?? ""}
                        onChange={(e) =>
                          setEdits({
                            ...edits,
                            [i._id]: e.target.value,
                          })
                        }
                        placeholder={String(i.stock)}
                        aria-label={`New stock quantity for ${i.name}`}
                        className="w-24 border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                      />

                      <button
                        type="button"
                        onClick={() => save(i)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shown.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            Showing {shown.length} of {items.length} items
          </div>
        )}
      </div>
    </div>
  );
}