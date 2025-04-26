import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePassword from "./pages/auth/ChangePassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StoreList from "./pages/admin/StoreList";
import StoreDetail from "./pages/admin/StoreDetail";
import StoreForm from "./pages/admin/StoreForm";
import UserList from "./pages/admin/UserList";
import UserDetail from "./pages/admin/UserDetail";
import UserForm from "./pages/admin/UserForm";

import UserStoreList from "./pages/user/StoreList";
import UserStoreDetail from "./pages/user/StoreDetail";

import OwnerDashboard from "./pages/owner/OwnerDashboard";

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* role */}
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" />
              ) : user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" />
              ) : user?.role === "STORE_OWNER" ? (
                <Navigate to="/owner/dashboard" />
              ) : (
                <Navigate to="/stores" />
              )
            }
          />

          {/* user */}
          <Route path="/stores" element={<UserStoreList />} />
          <Route path="/stores/:id" element={<UserStoreDetail />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* admin */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/stores" element={<StoreList />} />
            <Route path="/admin/stores/new" element={<StoreForm />} />
            <Route path="/admin/stores/:id" element={<StoreDetail />} />
            <Route path="/admin/stores/:id/edit" element={<StoreForm />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/users/new" element={<UserForm />} />
            <Route path="/admin/users/:id" element={<UserDetail />} />
            <Route path="/admin/users/:id/edit" element={<UserForm />} />
          </Route>

          {/* store */}
          <Route element={<RoleRoute allowedRoles={["STORE_OWNER"]} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
