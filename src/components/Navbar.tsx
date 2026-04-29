import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-orange-600 font-semibold" : "text-slate-600 hover:text-orange-600";

  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-orange-600">
          <Utensils /> Polifood
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <NavLink to="/" className={linkClass}>Menú</NavLink>
          <NavLink to="/orders" className={linkClass}>Pedidos</NavLink>
          {user?.role !== "Student" && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
          <NavLink to="/cart" className="relative rounded-full bg-orange-100 px-3 py-2 text-orange-700">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-orange-600 px-2 py-0.5 text-xs text-white">
                {totalItems}
              </span>
            )}
          </NavLink>
          {user ? (
            <button onClick={handleLogout} className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
              Salir
            </button>
          ) : (
            <Link to="/login" className="rounded-xl bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
