import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { RequireAuth, RequireRole } from "./context/AuthContext";
import Shell from "./components/layout/Shell";
import Login from "./pages/Auth/Login";
import PublicLookup from "./pages/Public/Lookup";
import ClientsList from "./pages/Clients/List";
import ClientDetail from "./pages/Clients/Detail";
import BatchesList from "./pages/Batches/List";
import BatchDetail from "./pages/Batches/Detail";
import Pricing from "./pages/Settings/Pricing";
import ShiftsManage from "./pages/Shifts/Manage";
import Maintenance from "./pages/Maintenance/List";
import DashboardAdmin from "./pages/Dashboard/Admin";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Navigate to="/public" replace />} />
            <Route path="/public" element={<PublicLookup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/clients"
              element={
                <RequireAuth>
                  <ClientsList />
                </RequireAuth>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <RequireAuth>
                  <ClientDetail />
                </RequireAuth>
              }
            />

            <Route
              path="/batches"
              element={
                <RequireAuth>
                  <BatchesList />
                </RequireAuth>
              }
            />
            <Route
              path="/batches/:id"
              element={
                <RequireAuth>
                  <BatchDetail />
                </RequireAuth>
              }
            />

            <Route
              path="/settings/pricing"
              element={
                <RequireAuth>
                  <RequireRole role="ADMIN">
                    <Pricing />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/shifts"
              element={
                <RequireAuth>
                  <RequireRole role="ADMIN">
                    <ShiftsManage />
                  </RequireRole>
                </RequireAuth>
              }
            />
            <Route
              path="/maintenance"
              element={
                <RequireAuth>
                  <Maintenance />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <RequireRole role="ADMIN">
                    <DashboardAdmin />
                  </RequireRole>
                </RequireAuth>
              }
            />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  );
}
