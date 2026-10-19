import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Package,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Card({ icon: Icon, label, value, color, description }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-orange-100/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/70">
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-orange-50 transition-transform duration-300 group-hover:scale-150" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>

          <h2 className="mt-3 break-words text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {value ?? 0}
          </h2>

          <p className="mt-2 text-xs text-gray-400">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={23} strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 group-hover:w-3/4" />
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-sm font-bold text-orange-600">
        Quantity sold: {payload[0].value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState(null);
  const [low, setLow] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      api
        .get("/analytics")
        .then(({ data }) => setStats(data))
        .catch(() => {});
    }

    api
      .get("/inventory/low-stock")
      .then(({ data }) => setLow(data.items || []))
      .catch(() => {});
  }, [isAdmin]);

  const popularFoods = stats?.popularFoods || [];

  return (
    <div className="min-h-full space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 p-6 text-white shadow-lg shadow-orange-200/60 sm:flex-row sm:items-center sm:p-7">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-orange-100">
            <LayoutDashboard size={17} />
            <span>Admin Panel</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-orange-50">
            Welcome back{user?.name ? `, ${user.name}` : ""}! Here's what's
            happening with KhanaQuick today.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-2xl border border-white/20 bg-white/15 sm:self-center">
          <TrendingUp size={29} />
        </div>
      </div>

      {/* Low stock alert */}
      {low.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-red-100 bg-red-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={21} />
              </div>

              <div>
                <h2 className="font-bold text-red-800">Low Stock Alert</h2>
                <p className="mt-0.5 text-sm text-red-600">
                  {low.length} {low.length === 1 ? "item needs" : "items need"}{" "}
                  your attention.
                </p>
              </div>
            </div>

            <Link
              to="/admin/inventory"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 sm:self-center"
            >
              Manage Inventory
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 p-5">
            {low.map((f) => (
              <span
                key={f._id}
                className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                <Package size={15} />
                <span className="font-semibold">{f.name}</span>
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold">
                  {f.stock} left
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Admin analytics */}
      {isAdmin && (
        <>
          {/* Statistics */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Business Summary
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your key performance numbers
                </p>
              </div>

              <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                Overview
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card
                icon={ClipboardList}
                label="Total Orders"
                value={stats?.totalOrders ?? "—"}
                color="bg-orange-100 text-orange-600"
                description="All orders received"
              />

              <Card
                icon={Clock}
                label="Orders In Queue"
                value={stats?.pendingOrders ?? "—"}
                color="bg-amber-100 text-amber-700"
                description="Orders awaiting completion"
              />

              <Card
                icon={CheckCircle2}
                label="Completed Orders"
                value={stats?.completedOrders ?? "—"}
                color="bg-emerald-100 text-emerald-700"
                description="Successfully completed"
              />

              <Card
                icon={IndianRupee}
                label="Paid Revenue"
                value={
                  stats
                    ? `₹${Number(stats.totalPaidRevenue || 0).toLocaleString(
                        "en-IN"
                      )}`
                    : "—"
                }
                color="bg-blue-100 text-blue-700"
                description="Total paid order revenue"
              />
            </div>
          </section>

          {/* Popular foods chart */}
          <section className="overflow-hidden rounded-2xl border border-orange-100/80 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Top Selling Items
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  See which food items customers order the most.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <TrendingUp size={21} />
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {!stats ? (
                <div className="flex h-72 flex-col items-center justify-center">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                  <p className="mt-3 text-sm text-gray-500">
                    Loading analytics...
                  </p>
                </div>
              ) : popularFoods.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
                    <ClipboardList size={27} />
                  </div>
                  <p className="mt-4 font-semibold text-gray-700">
                    No sales data yet
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Popular items will appear here once orders are recorded.
                  </p>
                </div>
              ) : (
                <div className="h-72 w-full sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={popularFoods}
                      margin={{
                        top: 12,
                        right: 12,
                        left: -15,
                        bottom: 8,
                      }}
                      barCategoryGap="28%"
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#f3f4f6"
                      />

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickMargin={12}
                      />

                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                      />

                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: "#fff7ed" }}
                      />

                      <Bar
                        dataKey="quantitySold"
                        name="Quantity sold"
                        fill="#f97316"
                        radius={[7, 7, 0, 0]}
                        maxBarSize={54}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Staff welcome section */}
      {!isAdmin && (
        <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <ClipboardList size={25} />
          </div>

          <h2 className="mt-4 text-xl font-extrabold text-gray-900">
            Welcome, {user?.name || "Team Member"}!
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Use the dashboard to access your daily tasks and manage orders or
            inventory.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <ClipboardList size={17} />
              Manage Orders
            </Link>

            <Link
              to="/admin/inventory"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
            >
              <Package size={17} />
              View Inventory
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}