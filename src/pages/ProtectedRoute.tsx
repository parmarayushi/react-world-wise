import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated }: any = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}
