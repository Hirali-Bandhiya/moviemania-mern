import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, hasActivePlan } from "../utils/auth";

function ProtectedRoute({
  children,
  requirePlan = false,
  unauthenticatedRedirect = "/login",
  unauthenticatedState = undefined,
}) {
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const activePlan = hasActivePlan();

  console.log("[ROUTE] ProtectedRoute check", {
    path: location.pathname,
    requirePlan,
    loggedIn,
    activePlan,
  });

  if (!loggedIn) {
    return <Navigate to={unauthenticatedRedirect} state={unauthenticatedState || { from: location.pathname }} replace />;
  }

  if (requirePlan && !activePlan) {
    return <Navigate to="/plans" replace />;
  }

  return children;
}

export default ProtectedRoute;