import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Student");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await register({ email, password, role });
    navigate("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-orange-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-slate-500">Por defecto tu backend usa el rol Student.</p>

        <label className="mt-6 block text-sm font-semibold">Correo</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />

        <label className="mt-4 block text-sm font-semibold">Contraseña</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={8} required className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />

        <label className="mt-4 block text-sm font-semibold">Rol</label>
        <select value={role} onChange={e => setRole(e.target.value as Role)} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
          <option value="Student">Student</option>
          <option value="Vendor">Vendor</option>
          <option value="Admin">Admin</option>
        </select>

        <button className="mt-6 w-full rounded-xl bg-orange-600 px-4 py-3 font-bold text-white hover:bg-orange-700">Registrarme</button>
        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-orange-600">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}
