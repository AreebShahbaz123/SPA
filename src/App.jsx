import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import BrowseRides from "./pages/BrowseRides";
import PostRide from "./pages/PostRide";
import MyActivity from "./pages/MyActivity";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with shared layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="rides" element={<BrowseRides />} />
        <Route path="post" element={<PostRide />} />
        <Route path="activity" element={<MyActivity />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}