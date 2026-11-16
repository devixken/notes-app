import { Center, Loader } from "@mantine/core";
import { Navigate } from "react-router";
import { useAuth } from "../auth/auth-context.js";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
