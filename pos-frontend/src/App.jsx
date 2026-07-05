import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard, Catalog } from "./pages";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Navigate to="/menu" replace />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoutes>
              <RoleGuard allowedRoles={["Admin", "Super Admin"]}>
                <Home />
              </RoleGuard>
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
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <RoleGuard allowedRoles={["Admin", "Super Admin"]}>
                <Dashboard />
              </RoleGuard>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/catalog"
          element={
            <ProtectedRoutes>
              <RoleGuard allowedRoles={["Admin", "Super Admin"]}>
                <Catalog />
              </RoleGuard>
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
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
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
