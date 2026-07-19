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
const Menu = lazy(() => import("./pages/Menu.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Catalog = lazy(() => import("./pages/Catalog.jsx"));
const Staff = lazy(() => import("./pages/Staff.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const ChangePassword = lazy(() => import("./pages/ChangePassword.jsx"));
const Restaurants = lazy(() => import("./pages/platform/Restaurants.jsx"));
const RestaurantDetail = lazy(() => import("./pages/platform/RestaurantDetail.jsx"));
import PlatformLayout from "./components/platform/PlatformLayout";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"
import AdminLayout from "./components/shared/AdminLayout";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ROLES } from "./constants/roles";

// Where a freshly-authenticated user should land, based on their role.
const homePathForRole = (role) =>
  role === ROLES.SUPER_ADMIN ? "/platform" : "/menu";

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const { isAuth, role } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  // The tenant header is only for tenant screens — the auth, forced-reset, and platform
  // screens all have their own full-screen chrome.
  const hideHeader =
    location.pathname === "/auth" ||
    location.pathname === "/change-password" ||
    location.pathname.startsWith("/platform");

  return (
    <>
      {!hideHeader && <Header />}
      <ErrorBoundary key={location.pathname}>
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
          <Route path="/auth" element={isAuth ? <Navigate to={homePathForRole(role)} replace /> : <Auth />} />
          <Route
            path="/change-password"
            element={
              !isAuth ? <Navigate to="/auth" replace /> : <ChangePassword />
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoutes>
                <Orders />
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
                <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                  <AdminLayout />
                </RoleGuard>
              </ProtectedRoutes>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Platform area — Super Admin only, separate from the tenant screens. */}
          <Route
            path="/platform"
            element={
              <PlatformRoutes>
                <PlatformLayout />
              </PlatformRoutes>
            }
          >
            <Route index element={<Restaurants />} />
            <Route path="restaurants/:id" element={<RestaurantDetail />} />
          </Route>

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </>
  );
}

// Tenant screens: authenticated non-super-admins only. Super Admin is bounced to its platform area.
function ProtectedRoutes({ children }) {
  const { isAuth, role, forcePasswordChange } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  if (forcePasswordChange) {
    return <Navigate to="/change-password" replace />;
  }
  if (role === ROLES.SUPER_ADMIN) {
    return <Navigate to="/platform" replace />;
  }
  return children;
}

// Platform screens: Super Admin only. Everyone else goes back to the tenant home.
function PlatformRoutes({ children }) {
  const { isAuth, role, forcePasswordChange } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  if (forcePasswordChange) {
    return <Navigate to="/change-password" replace />;
  }
  if (role !== ROLES.SUPER_ADMIN) {
    return <Navigate to="/menu" replace />;
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
