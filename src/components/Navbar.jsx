import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Check logged user
  useEffect(() => {
    setUser(getCurrentUser());

    const onStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Series", path: "/series" },
    { name: "Offers", path: "/offers" },
  ];

  if (!user) {
    navLinks.push({ name: "Plans", path: "/plans" });
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <h1 className="text-2xl font-black text-red-600 tracking-wider">
              MOVIEMANIA
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition ${
                  isActive(link.path)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT - Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Auth Buttons */}
          <div className="flex items-center gap-4 text-sm">
            {!user ? (
              <>
                <button onClick={() => navigate("/login")} className="text-gray-300 hover:text-white font-medium">
                  Login
                </button>
                <button onClick={() => navigate("/register")} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-bold text-white transition-colors">
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-300 cursor-default">
                  Hi, {user.name}
                </span>
                <button onClick={() => navigate("/wishlist")} className="text-gray-300 hover:text-white font-medium transition">
                  Wishlist
                </button>
                <button onClick={() => navigate("/dashboard")} className="text-gray-300 hover:text-white font-medium transition">
                  Dashboard
                </button>
                <button onClick={() => navigate("/profile")} className="text-gray-300 hover:text-white font-medium transition">
                  Profile
                </button>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-bold text-white transition-colors">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-300 hover:text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 shadow-xl flex flex-col p-6 gap-6">
          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-4 text-lg font-semibold border-b border-white/10 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-left transition ${
                  isActive(link.path)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-4 text-base font-medium">
            {!user ? (
              <>
                <button onClick={() => handleNavigation("/login")} className="text-gray-300 hover:text-white text-left">
                  Login
                </button>
                <button onClick={() => handleNavigation("/register")} className="bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-white text-center">
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-400 pb-2">Logged in as {user.name}</span>
                <button onClick={() => handleNavigation("/wishlist")} className="text-gray-300 hover:text-white text-left">
                  Wishlist
                </button>
                <button onClick={() => handleNavigation("/dashboard")} className="text-gray-300 hover:text-white text-left">
                  Dashboard
                </button>
                <button onClick={() => handleNavigation("/profile")} className="text-gray-300 hover:text-white text-left">
                  Profile
                </button>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 py-3 mt-2 rounded-lg font-bold text-white text-center">
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;