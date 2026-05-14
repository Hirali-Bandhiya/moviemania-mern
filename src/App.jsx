import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import Plans from "./features/plans/pages/Plans";
import Series from "./pages/Series";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Dashboard";
import WatchMovie from "./pages/WatchMovie";
import Offers from "./pages/Offers";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./admin/AdminDashboard";
import AdminMovies from "./admin/AdminMovies";
import AdminSeries from "./admin/AdminSeries";
import AdminUsers from "./admin/AdminUsers";
import AdminPlans from "./admin/AdminPlans";
import AdminOffers from "./admin/AdminOffers";
import AdminPayments from "./admin/AdminPayments";
import AdminLogin from "./admin/AdminLogin";
import AdminProfile from "./admin/AdminProfile";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import Payment from "./pages/Payment";
import Wishlist from "./features/wishlist/pages/Wishlist";


import { isLoggedIn } from "./utils/auth";
import { Navigate } from "react-router-dom";

const LoginProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Guest routes */}
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/anime" element={<Navigate to="/" replace />} />
        <Route path="/tvshows" element={<Navigate to="/" replace />} />
        <Route path="/offers" element={<Offers />} />

        <Route path="/wishlist" element={<LoginProtectedRoute><Wishlist /></LoginProtectedRoute>} />
        
        <Route
          path="/movies"
          element={<Movies />}
        />
        <Route
          path="/series"
          element={<Series />}
        />

        {/* Public Details Page */}
        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

        {/* Protected Pages */}
        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <WatchMovie />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Profile */}
        <Route
          path="/admin-profile"
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <AdminProtectedRoute>
              <AdminMovies />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/series"
          element={
            <AdminProtectedRoute>
              <AdminSeries />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <AdminProtectedRoute>
              <AdminPlans />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <AdminProtectedRoute>
              <AdminOffers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminProtectedRoute>
              <AdminPayments />
            </AdminProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
