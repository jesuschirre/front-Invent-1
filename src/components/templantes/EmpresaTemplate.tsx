import { useEffect, useState } from "react";
import { EditarEmpresa, type Empresa } from "../../supabase/crudEmpresa";
import { UserAuth } from "../../context/AuthContext";
import { GrFormCheckmark, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

export default function EmpresaTemplate() {
  const { empresa } = UserAuth();
  const [editEmpresa, setEditEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empresa?.empresa) {
      setEditEmpresa({
        id: empresa.empresa.id,
        nombre: empresa.empresa.nombre,
        simbolomone: empresa.empresa.simbolomone,
      });
    }
  }, [empresa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmpresa || loading) return;

    setLoading(true);
    const ok = await EditarEmpresa(editEmpresa);
    setLoading(false);

    if (ok) {
      Swal.fire({
        title: "¡ACTUALIZADO!",
        text: "Los datos de la empresa han sido guardados.",
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: {
          popup: "border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
          confirmButton: "bg-yellow-400 text-black font-black uppercase p-4 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        }
      });
    }
  };

  if (!editEmpresa) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <GrRotateLeft className="animate-spin" size={40} />
      </div>
    );
  }

  const inputStyles = "w-full border-4 border-black p-3 font-black uppercase text-sm focus:bg-yellow-50 outline-none transition-colors dark:bg-zinc-800 dark:text-white placeholder:text-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]";
  const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-black text-white p-6 flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Configuración de Empresa
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ajustes globales del sistema</p>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelStyles}>Razón Social / Nombre</label>
              <input
                value={editEmpresa.nombre}
                onChange={(e) => setEditEmpresa({ ...editEmpresa, nombre: e.target.value })}
                className={inputStyles}
                placeholder="Nombre de tu empresa"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelStyles}>Símbolo de Moneda</label>
              <input
                value={editEmpresa.simbolomone}
                onChange={(e) => setEditEmpresa({ ...editEmpresa, simbolomone: e.target.value })}
                className={inputStyles}
                placeholder="Ej: S/ , $ , €"
                maxLength={5}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 border-4 border-black font-black uppercase bg-[#fee685] hover:bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0"
            >
              {loading ? (
                <GrRotateLeft className="animate-spin" size={20} />
              ) : (
                <GrFormCheckmark size={24} />
              )}
              <span>{loading ? "Guardando cambios..." : "Guardar Configuración"}</span>
            </button>
          </div>
        </form>

        {/* FOOTER DECORATIVO */}
        <div className="bg-gray-100 dark:bg-zinc-800 p-4 border-t-4 border-black text-center">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">ID Empresa: {editEmpresa.id}</p>
        </div>
      </div>
    </div>
  );
}