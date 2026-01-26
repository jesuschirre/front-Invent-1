import { useState } from "react";
import { useMarcaStore } from "../../../store/MarcaStore";
import { UserAuth } from "../../../context/AuthContext";
import { GrClose, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
}

export default function ModalMarca({ onClose }: Props) {
  const [descripcion, setDescripcion] = useState("");
  const { insertarMarca } = useMarcaStore();
  const { empresa } = UserAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!descripcion.trim()) return;
      if (!descripcion) { 
        Swal.fire({
          icon: "warning",
          title: "DATOS INCOMPLETOS",
          text: "Complete los datos",
          confirmButtonColor: "#000000",
        });
        return;
      } 
      setLoading(true)
      const res = await insertarMarca({
        _descripcion: descripcion,
        _idempresa: empresa?.empresa?.id,
      });
      setDescripcion("");
      onClose();
      if (res) {
        await Swal.fire({
          icon: "success",
          title: "INSERTADO",
          text: "La marca fue introducido Satisfactoriamente",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No se pudo guardar la marca",
        confirmButtonColor: "#000000",
      });
      onClose();
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#fee685] border-b-4 border-black p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              Nueva Marca
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors"
          >
            <GrClose size={20} />
          </button>
        </div>

        {/* CONTENIDO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block">
              Nombre del Fabricante <span className="text-red-500">(*)</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="EJ: NIKE, SONY, APPLE..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border-4 border-black p-4 font-black uppercase text-sm focus:bg-[#fee685] outline-none transition-colors dark:bg-zinc-800 dark:text-black placeholder:text-gray-400"
              required
            />
          </div>

          {/* BOTONES */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-3 pt-4 sticky bottom-0 bg-white dark:bg-zinc-900 py-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 font-black uppercase border-4 border-black bg-white hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled= {!descripcion || loading}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
              bg-yellow-400 hover:bg-yellow-500 
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-none transition-all flex justify-center items-center gap-2 
              disabled:opacity-50"
            >
              {loading && <GrRotateLeft className="animate-spin" />}
              {loading ? "Creando..." : "Crear Marca"}
            </button>

          </div>
        </form>

        {/* DECORACIÓN INFERIOR */}
        <div className="h-2 bg-black w-full" />
      </div>
    </div>
  );
}