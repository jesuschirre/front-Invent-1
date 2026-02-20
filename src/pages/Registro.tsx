import { useState } from "react";
import { useUsuarioStore } from "../store/UsuariosStore";

export default function Registro() {
  const { InsertUsuAdmin } = useUsuarioStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await InsertUsuAdmin({
      email,
      pass: password,
    });

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm space-y-6 rounded-xl bg-slate-800 p-6 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center">Registro Admin</h1>

        {/* EMAIL */}
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@empresa.com"
            className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full rounded-lg bg-slate-700 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2 font-semibold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Registrando..." : "Crear Administrador"}
        </button>
      </form>
    </div>
  );
}
