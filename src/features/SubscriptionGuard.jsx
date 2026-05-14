import { Navigate, useLocation } from "react-router-dom";
import { hasActivePlan } from "../utils/auth";

function SubscriptionGuard({ children }) {
  const location = useLocation();
  const plan = hasActivePlan();

  if (!plan) {
    return <Navigate to="/plans" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default SubscriptionGuard;
