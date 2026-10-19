import { useEffect, useState } from "react";
import { Search, Clock, Flame } from "lucide-react";
import api from "../../api/axios";
import FoodCard from "../../components/FoodCard";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Menu() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const canOrder = user?.role === "student";

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [trending, setTrending] = useState([]);
  const [queue, setQueue] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch categories and trending foods
  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});

    api
      .get("/foods/trending")
      .then(({ data }) => setTrending(data.trendingFoods || []))
      .catch(() => {});
  }, []);

  // Refresh live queue every 10 seconds
  useEffect(() => {
    const loadQueue = () => {
      api
        .get("/orders/queue")
        .then(({ data }) => setQueue(data))
        .catch(() => {});
    };

    loadQueue();

    const intervalId = setInterval(loadQueue, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch foods when category or search changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const params = {};

        if (activeCategory !== "all") {
          params.category = activeCategory;
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        const { data } = await api.get("/foods", { params });

        setFoods(data);
      } catch {
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  const tabClass = (active) =>
    `shrink-0 rounded-full border px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
      active
        ? "border-orange-500 bg-orange-500 text-white shadow-sm"
        : "border-orange-100 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
    }`;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#fffaf5] text-gray-900">
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-orange-200/25 blur-[100px]" />

        <div className="absolute -right-40 top-64 h-96 w-96 rounded-full bg-amber-100/40 blur-[100px]" />

        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-orange-100/30 blur-[100px]" />
      </div>

      {/* Main content with reduced top spacing */}
<div className="relative z-10 w-full max-w-none px-0 pb-6 pt-3">        {/* Live Queue */}
        {queue && (
          <section className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Clock size={20} />
              </div>

              <span className="font-bold text-gray-900">
                Live Queue
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600">
              <span>
                <strong className="text-gray-900">
                  {queue.queueCount}
                </strong>{" "}
                orders in queue
              </span>

              <span>
                Estimated wait:{" "}
                <strong className="text-orange-600">
                  ~{queue.estimatedWaitMinutes} min
                </strong>
              </span>
            </div>

            <span className="ml-auto flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Live updates
            </span>
          </section>
        )}

        {/* Trending Foods */}
        {trending.length > 0 && (
          <section className="mb-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                <Flame size={21} className="text-orange-600" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                Trending now
              </h2>

              <span className="hidden text-sm text-gray-400 sm:inline">
                Popular picks
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {trending.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearch(item.name);
                  }}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 sm:px-5"
                >
                  <Flame size={15} className="shrink-0 text-orange-500" />

                  <span>{item.name}</span>

                  <span className="font-bold text-orange-600">
                    ₹{item.price}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Search Bar */}
        <section className="mb-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your favourite food..."
              aria-label="Search food"
              className="w-full rounded-xl border border-orange-100 bg-white py-3 pl-12 pr-4 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:text-base"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mb-5">
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={tabClass(activeCategory === "all")}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => setActiveCategory(category._id)}
                className={tabClass(activeCategory === category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Food Grid */}
        <section>
          {loading ? (
            <div className="rounded-xl border border-orange-100 bg-white py-12 text-center">
              <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

              <p className="text-sm font-medium text-gray-500">
                Loading menu...
              </p>
            </div>
          ) : foods.length === 0 ? (
            <div className="rounded-xl border border-orange-100 bg-white px-5 py-12 text-center">
              <div className="mb-3 text-5xl">🍽️</div>

              <h3 className="text-lg font-bold text-gray-800">
                No food items found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="mt-4 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                View all foods
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {foods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  canOrder={canOrder}
                  onAdd={addToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}