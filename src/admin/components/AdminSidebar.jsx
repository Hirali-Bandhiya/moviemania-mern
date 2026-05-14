import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Film, Tv, Users, CreditCard, Zap, ChevronRight } from "lucide-react";

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Movies", path: "/admin/movies", icon: <Film size={20} /> },
    { name: "Series", path: "/admin/series", icon: <Tv size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Plans", path: "/admin/plans", icon: <Zap size={20} /> },
    { name: "Offers", path: "/admin/offers", icon: <CreditCard size={20} /> },
    { name: "Payments", path: "/admin/payments", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0f172a]/90 backdrop-blur-xl border-r border-white/5 text-white h-screen fixed left-0 top-0 p-4 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between mb-8 px-2 overflow-hidden whitespace-nowrap">
        <h2 className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800">
          ADMIN PRO
        </h2>
      </div>

      <nav className="flex-1 space-y-3 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 group ${
              isActive(item.path)
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/30 font-semibold"
                : "text-gray-400 hover:bg-white/5 hover:text-white hover:scale-[1.02]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`${isActive(item.path) ? "animate-pulse" : "group-hover:text-red-500 transition-colors"}`}>
                {item.icon}
              </div>
              <span className="whitespace-nowrap">{item.name}</span>
            </div>
            {isActive(item.path) && <ChevronRight size={16} className="opacity-50" />}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-gradient-to-t from-red-900/20 to-transparent rounded-xl border border-red-500/10 text-center">
        <p className="text-xs text-gray-400">MovieMania System</p>
        <p className="text-xs font-bold text-red-500 mt-1">v2.0 Beta</p>
      </div>
    </div>
  );
}

export default AdminSidebar;