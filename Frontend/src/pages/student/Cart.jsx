import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, total, loading, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fff8ef]">
        <p className="font-medium text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gradient-to-br from-[#fffaf2] to-[#ffedd8] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
            <ShoppingBag size={38} className="text-orange-400" />
          </div>

          <h1 className="text-2xl font-black text-gray-800">
            Your Cart Is Empty
          </h1>

          <p className="mb-6 mt-2 text-sm text-gray-500">
            Delicious food is waiting for you. Add your favourites to get started!
          </p>

          <Link
            to="/"
            className="inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-58px)] bg-gradient-to-br from-[#fffaf2] via-[#fff5e9] to-[#ffedd8] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <ShoppingBag size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">
                Your <span className="text-orange-500">Cart</span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review your delicious choices
              </p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-3">
          {items.map(({ food, quantity }) => (
            <div
              key={food._id}
              className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-4 sm:p-5"
            >
              {/* Food Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:h-14 sm:w-14">
                <ShoppingBag size={24} />
              </div>

              {/* Food Details */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-gray-800">
                  {food.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  ₹{food.price} each
                </p>

                <p className="mt-1 font-bold text-orange-600 sm:hidden">
                  ₹{food.price * quantity}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/70 p-1">
                <button
                  onClick={() =>
                    quantity > 1 && updateQty(food._id, quantity - 1)
                  }
                  disabled={quantity <= 1}
                  aria-label={`Decrease quantity of ${food.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>

                <span className="w-5 text-center text-sm font-bold text-gray-800">
                  {quantity}
                </span>

                <button
                  onClick={() => updateQty(food._id, quantity + 1)}
                  aria-label={`Increase quantity of ${food.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Item Price */}
              <p className="hidden w-20 shrink-0 text-right font-bold text-gray-800 sm:block">
                ₹{food.price * quantity}
              </p>

              {/* Remove Item */}
              <button
                onClick={() => removeItem(food._id)}
                aria-label={`Remove ${food.name} from cart`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-5 rounded-2xl border border-white bg-white p-5 shadow-md sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold text-gray-800">
            Order Summary
          </h2>

          <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-4">
            <span className="text-sm text-gray-500">Items</span>
            <span className="font-semibold text-gray-700">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-base font-bold text-gray-800">
              Total Amount
            </span>

            <span className="text-2xl font-black text-orange-600">
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl"
          >
            Proceed to Checkout
            <span aria-hidden="true">→</span>
          </button>

          <Link
            to="/"
            className="mt-4 block text-center text-sm font-semibold text-gray-500 transition hover:text-orange-600"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}