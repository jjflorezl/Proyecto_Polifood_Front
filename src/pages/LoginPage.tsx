import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("student@polifood.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("No se pudo iniciar sesión. Revisa tus credenciales.");
    } finally {
      setLoading(false);
      }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-orange-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Entrar a Polifood</h1>
        <p className="mt-2 text-slate-500">Pide comida dentro de la universidad.</p>

        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <label className="mt-6 block text-sm font-semibold">Correo</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />

        <label className="mt-4 block text-sm font-semibold">Contraseña</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />

        <button disabled={loading || !email || !password} className="mt-6 w-full rounded-xl bg-orange-600 px-4 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-orange-400 disabled:hover:bg-orange-400">{loading ? "Ingresando..." : "Iniciar sesión"}</button>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿No tienes cuenta? <Link to="/register" className="font-semibold text-orange-600">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}
