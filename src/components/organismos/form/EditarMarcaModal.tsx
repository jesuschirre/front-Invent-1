import type { Marca } from "../../../supabase/crudMarca";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useState } from "react";
import { GrClose, GrEdit, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  marca: Marca;
  onClose: () => void;
}

export default function EditarMarcaModal({ marca, onClose }: Props) {
  const { editarMarca } = useMarcaStore();

  const [marcaEdit, setMarcaEdit] = useState<Marca>(marca);
  const [loading, setLoading] = useState(false);

  const EditarMar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!marcaEdit.descripcion) {
        Swal.fire({
          icon: "warning",
          title: "DATOS INCOMPLETOS",
          text: "Complete todos los campos",
          confirmButtonColor: "#000000",
        });
        return;
      }
      setLoading(true);
      const res = await editarMarca(marcaEdit);
      onClose();
      if (res) {
        await Swal.fire({
          icon: "success",
          title: "¡ACTUALIZADO!",
          text: "La información de la marca se sincronizó correctamente.",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No actualizar la marca",
        confirmButtonColor: "#000000",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border-4 border-black p-4 font-black uppercase text-sm focus:bg-[#fee685]/20 outline-none transition-colors dark:bg-zinc-800 dark:text-white placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative overflow-hidden">
        
        {/* HEADER - AMARILLO NEO-BRUTALISTA */}
        <div className="bg-[#fee685] border-b-4 border-black p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]">
              <GrEdit size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">
              Editar Marca<span className="not-italic">_</span>
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
          >
            <GrClose size={20} />
          </button>
        </div>

        {/* CONTENIDO */}
        <form onSubmit={EditarMar} className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                Nombre del Fabricante <span className="text-red-500">(*)</span>
              </label>
            </div>
            <input
              type="text"
              autoFocus
              value={marcaEdit.descripcion}
              onChange={(e) =>
                setMarcaEdit({
                  ...marcaEdit,
                  descripcion: e.target.value,
                })
              }
              className={inputStyles}
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
              disabled={!marcaEdit.descripcion ||loading}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
              bg-yellow-400 hover:bg-yellow-500 
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-none transition-all flex justify-center items-center gap-2 
              disabled:opacity-50">
                {loading && <GrRotateLeft className="animate-spin" />}
                {loading ? "Actualizando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>

        {/* DECORACIÓN INFERIOR */}
        <div className="h-2 bg-black w-full" />
      </div>
    </div>
  );
}