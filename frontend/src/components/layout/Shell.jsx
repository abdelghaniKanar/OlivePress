import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-green-700 text-white" : "text-green-900 hover:bg-green-100"}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-dvh bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🫒</span>
            <span className="font-semibold text-green-900">Zaytena</span>
          </Link>
          <nav className="flex items-center gap-2">
            {!user && <NavItem to="/track">My Batches</NavItem>}
            {user && (
              <>
                <NavItem to="/clients">Clients</NavItem>
                <NavItem to="/batches">Batches</NavItem>
                {user.role === "ADMIN" && (
                  <>
                    <NavItem to="/dashboard">Dashboard</NavItem>
                    <NavItem to="/settings/pricing">Pricing</NavItem>
                    <NavItem to="/shifts">Shifts</NavItem>
                    <NavItem to="/maintenance">Maintenance</NavItem>
                  </>
                )}
                <button
                  onClick={logout}
                  className="ml-2 px-3 py-2 text-sm rounded-md bg-green-700 text-white"
                >
                  Logout
                </button>
              </>
            )}
            {!user && <NavItem to="/login">Login</NavItem>}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}
