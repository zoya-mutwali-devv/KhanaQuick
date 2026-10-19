import { useState } from "react";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function ReviewModal({ order, onClose }) {
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(null);

  const setField = (foodId, key, value) =>
    setData((d) => ({ ...d, [foodId]: { ...d[foodId], [key]: value } }));

  const submit = async (item) => {
    const entry = data[item.food] || {};
    if (!entry.rating) return toast.error("Please select a rating");
    setSaving(item.food);
    try {
      await api.post("/reviews", {
        food: item.food,
        rating: entry.rating,
        comment: entry.comment || "",
      });
      toast.success(`Thanks for reviewing ${item.name}`);
      setField(item.food, "done", true);
    } catch (err) {
      const status = err.response?.status;
      toast.error(
        status === 409
          ? "You have already reviewed this item"
          : err.response?.data?.message || "Could not submit review"
      );
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Rate your order</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-5">
          {order.items.map((item) => {
            const entry = data[item.food] || {};
            return (
              <div key={item.food} className="border-b pb-4 last:border-0">
                <p className="font-medium mb-2">{item.name}</p>
                {entry.done ? (
                  <p className="text-sm text-green-600">Review submitted ✓</p>
                ) : (
                  <>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => setField(item.food, "rating", n)}>
                          <Star
                            size={26}
                            className={n <= (entry.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={2}
                      maxLength={1000}
                      placeholder="Write feedback (optional)"
                      value={entry.comment || ""}
                      onChange={(e) => setField(item.food, "comment", e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                      onClick={() => submit(item)}
                      disabled={saving === item.food}
                      className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm disabled:opacity-60"
                    >
                      {saving === item.food ? "Submitting..." : "Submit"}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}