import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout, getCurrentUser } from "../../utils/auth";

function AdminNavbar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const handleProfileClick = () => {
    navigate("/admin-profile");
  };

  return (
    <div className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 text-white h-20 px-8 flex justify-between items-center sticky top-0 z-40 shadow-sm shadow-black/20">
      
      <div className="flex items-center gap-6 ml-auto">
        <div className="h-8 w-px bg-gray-700 mx-2"></div>

        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 cursor-pointer hover:shadow-purple-500/40 transition">
            {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD'}
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-gray-100 leading-tight">{currentUser?.name || 'Admin User'}</p>
            <p className="text-xs text-red-500 font-medium">{currentUser?.role || 'Superadmin'}</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="ml-4 bg-white/5 hover:bg-red-600/20 hover:text-red-500 border border-white/10 hover:border-red-500/30 p-2.5 rounded-xl text-gray-300 transition-all duration-300"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default AdminNavbar;