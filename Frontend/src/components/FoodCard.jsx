import { Plus, ImageOff } from "lucide-react";

export default function FoodCard({ food, canOrder, onAdd }) {
  const outOfStock = !food.isAvailable || food.stock <= 0;
  const lowStock = !outOfStock && food.stock <= food.lowStockThreshold;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="h-40 bg-orange-100 flex items-center justify-center">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <ImageOff className="text-orange-300" size={36} />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{food.name}</h3>
          <span className="font-bold text-orange-600 whitespace-nowrap">₹{food.price}</span>
        </div>

        {food.category?.name && (
          <p className="text-xs text-gray-500 mt-1">{food.category.name}</p>
        )}
        {food.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{food.description}</p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          {outOfStock ? (
            <span className="text-sm font-medium text-red-500">Out of stock</span>
          ) : lowStock ? (
            <span className="text-sm font-medium text-amber-600">Only {food.stock} left</span>
          ) : (
            <span className="text-sm text-green-600">Available</span>
          )}

          {canOrder && (
            <button
              onClick={() => onAdd(food._id)}
              disabled={outOfStock}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={16} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}