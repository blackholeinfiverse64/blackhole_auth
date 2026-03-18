import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const PublicRoute = ({ children }) => {
  const { user, isBootstrapping } = useAuth();
  if (isBootstrapping) return <Spinner label="Checking secure session..." />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default PublicRoute;
