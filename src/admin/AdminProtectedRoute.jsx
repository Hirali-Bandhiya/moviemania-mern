import { Navigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn, isAdminUser } from "../utils/auth";
import { ROUTES } from "../constants/routes";

function AdminProtectedRoute({ children }) {
  const user = getCurrentUser();

  if (!isLoggedIn() || !isAdminUser(user)) {
    return <Navigate to={ROUTES.ADMIN_LOGIN || "/admin-login"} replace />;
  }

  return children;
}

export default AdminProtectedRoute;