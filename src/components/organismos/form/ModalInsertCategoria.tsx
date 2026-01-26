import { useState } from "react";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { UserAuth } from "../../../context/AuthContext";
import { GrClose, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
}

export default function ModalInsertCategoria({ onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [color, setColor] = useState("#22d3ee"); // Color por defecto
  const { insertarcategorias } = useCategoriasStore();
  const { empresa } = UserAuth();
  const [loading, setLoading] = useState(false);

  const colores = [
    "#22d3ee", "#0ea5e9", "#22c55e", "#facc15",
    "#f97316", "#ef4444", "#8b5cf6", "#ec4899",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (!nombre || !descripcion || !color) {
        Swal.fire({
          icon: "warning",
          title: "DATOS INCOMPLETOS",
          text: "Complete todos los datos",
          confirmButtonColor: "#000000",
        });
      }

      setLoading(true);

      if (!nombre.trim() || !descripcion.trim()) return;

      const response = await insertarcategorias({
        _nombre: nombre,
        _descripcion: descripcion,
        _idempresa: empresa?.empresa?.id,
        _color: color,
      });
    
      onClose();

      if (response)  {
        await Swal.fire({
          icon: "success",
          title: "INSERTADO",
          text: "La Categoria fue introducido Satisfactoriamente",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      console.error(error);
        Swal.fire({
          icon: "error",
          title: "ERROR",
          text: "No se pudo guardar la categoria",
          confirmButtonColor: "#000000",
        });
      onClose();
    } finally {
      setLoading(false)
    }

  };

  const inputStyles = "w-full border-4 border-black p-3 font-black uppercase text-sm focus:bg-[#fee685]/20 outline-none transition-colors dark:bg-zinc-800 dark:text-white placeholder:text-gray-400";
  const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 block";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#fee685] border-b-4 border-black p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              Nueva Categoría
            </h2>
          </div>
          <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
            <GrClose size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className={labelStyles}>Nombre Identificador <span className="text-red-500">(*)</span></label>
            <input
              type="text"
              placeholder="Ej: Electrónicos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Descripción Breve <span className="text-red-500">(*)</span></label>
            <input
              type="text"
              placeholder="Productos de tecnología..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={inputStyles}
              required
            />
          </div>

          {/* SELECTOR DE COLOR */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Color de Etiqueta <span className="text-red-500">(*)</span>
            </label>
            <div className="grid grid-cols-4 gap-3 bg-gray-100 dark:bg-zinc-800 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {colores.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-10 w-full border-4 transition-all ${
                    color === c 
                    ? "border-black scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row gap-3 pt-4 sticky bottom-0 bg-white dark:bg-zinc-900 py-2">
            {/* BOTONES */}
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 px-4 py-3 font-black uppercase border-4 border-black bg-white hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={ !nombre || !descripcion || !color || loading}
                className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
                bg-yellow-400 hover:bg-yellow-500 
                shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
                active:shadow-none transition-all flex justify-center items-center gap-2 
                disabled:opacity-50"
              >
                {loading && <GrRotateLeft className="animate-spin" />}
                {loading ? "Creando..." : "Crear Categoria"}
              </button>
          </div>

        </form>

        <div className="h-2 bg-black w-full" />
      </div>
    </div>
  );
}