import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, hasActivePlan } from "../utils/auth";
import { ROUTES } from "../constants/routes";

function ProtectedRoute({
  children,
  requirePlan = false,
  unauthenticatedRedirect = ROUTES.LOGIN,
  unauthenticatedState = undefined,
}) {
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const activePlan = hasActivePlan();

  if (!loggedIn) {
    return <Navigate to={unauthenticatedRedirect} state={unauthenticatedState || { from: location.pathname }} replace />;
  }

  if (requirePlan && !activePlan) {
    return <Navigate to={ROUTES.PLANS} replace />;
  }

  return children;
}

export default ProtectedRoute;