import { Navigate, Route, Routes } from "react-router";
import { RequireAuth } from "./components/RequireAuth.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { NotesPage } from "./pages/NotesPage.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <NotesPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
