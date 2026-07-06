import { useInitializeData } from "./hooks/useInitializeData";
import { useOfflineSync } from "./hooks/useOfflineSync";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
const Auth = lazy(() => import("./pages/Auth.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Tables = lazy(() => import("./pages/Tables.jsx"));
const Menu = lazy(() => import("./pages/Menu.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Catalog = lazy(() => import("./pages/Catalog.jsx"));
const Staff = lazy(() => import("./pages/Staff.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"
import AdminLayout from "./components/shared/AdminLayout";
import ErrorBoundary from "./components/shared/ErrorBoundary";

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Navigate to="/menu" replace />
              </ProtectedRoutes>
            }
          />
          <Route path="/auth" element={isAuth ? <Navigate to="/menu" /> : <Auth />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoutes>
                <Orders />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoutes>
                <Tables />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoutes>
                <Menu />
              </ProtectedRoutes>
            }
          />
          <Route
            element={
              <ProtectedRoutes>
                <RoleGuard allowedRoles={["Admin", "Super Admin"]}>
                  <AdminLayout />
                </RoleGuard>
              </ProtectedRoutes>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function RoleGuard({ allowedRoles, children }) {
  const { role } = useSelector((state) => state.user);
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/menu" replace />;
  }
  return children;
}

function App() {
  useInitializeData();
  useOfflineSync();
  return (
    <ErrorBoundary>
      <Router>
        <Layout />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
