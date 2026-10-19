import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Utensils, Tags, Boxes, TicketPercent, BarChart3 } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/foods", label: "Foods", icon: Utensils },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
];

export default function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row gap-5">
      <aside className="md:w-52 shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-2 flex md:flex-col gap-1 overflow-x-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-100"
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </div>
      </aside>
      <section className="flex-1 min-w-0">
        <Outlet />
      </section>
    </div>
  );
}