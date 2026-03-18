import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, isBootstrapping } = useAuth();
  if (isBootstrapping) return <Spinner label="Checking secure session..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
