import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import SideBar from "./components/SideBar";
import { getUser } from "./store/slices/authSlice";

function App() {
  const { openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated, isCheckingAuth } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium text-sm">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (openedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Users":
        return <Users />;
      case "Profile":
        return <Profile />;
      case "Products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router basename="/dashboard">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/password/forgot"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <Navigate to="/" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route
          path="/password/reset/:token"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <Navigate to="/" replace />
            ) : (
              <ResetPassword />
            )
          }
        />
        {/* Protected Admin Route */}
        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <div className="flex min-h-screen">
                <SideBar />
                {renderDashboardContent()}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;
