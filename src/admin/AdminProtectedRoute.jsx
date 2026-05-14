import { Navigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "../utils/auth";


function AdminProtectedRoute({ children }) {
  const user = getCurrentUser();

  if (!isLoggedIn() || (user?.isAdmin !== true && user?.role !== "Admin")) {
    return <Navigate to="/admin-login" />;
  }
  return children;
}
export default AdminProtectedRoute;