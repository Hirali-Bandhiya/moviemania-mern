import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import { ROUTES } from "./constants/routes";

const LoginProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Guest routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PLANS} element={<Plans />} />
        <Route path={ROUTES.PAYMENT} element={<Payment />} />
        <Route path={ROUTES.ANIME} element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.TV_SHOWS} element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.OFFERS} element={<Offers />} />

        <Route path={ROUTES.WISHLIST} element={<LoginProtectedRoute><Wishlist /></LoginProtectedRoute>} />
        
        <Route
          path={ROUTES.MOVIES}
          element={<Movies />}
        />
        <Route
          path={ROUTES.SERIES}
          element={<Series />}
        />

        {/* Public Details Page */}
        <Route
          path={ROUTES.MOVIE_DETAILS}
          element={<MovieDetails />}
        />

        {/* Protected Pages */}
        <Route
          path={ROUTES.WATCH_MOVIE}
          element={
            <ProtectedRoute>
              <WatchMovie />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.EDIT_PROFILE}
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Login */}
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

        {/* Admin Profile */}
        <Route
          path={ROUTES.ADMIN_PROFILE}
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_MOVIES}
          element={
            <AdminProtectedRoute>
              <AdminMovies />
            </AdminProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_SERIES}
          element={
            <AdminProtectedRoute>
              <AdminSeries />
            </AdminProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_PLANS}
          element={
            <AdminProtectedRoute>
              <AdminPlans />
            </AdminProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_OFFERS}
          element={
            <AdminProtectedRoute>
              <AdminOffers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_PAYMENTS}
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
