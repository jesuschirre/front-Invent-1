import type { Marca } from "../../../supabase/crudMarca";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useState } from "react";

interface Props {
  marca: Marca;
  onClose: () => void;
}

export default function EditarMarcaModal({ marca, onClose }: Props) {
  const { editarMarca } = useMarcaStore();

  const [marcaEdit, setMarcaEdit] = useState<Marca>(marca);
  const [loading, setLoading] = useState(false);

  const EditarMar = async () => {
    try {
      setLoading(true);
      await editarMarca(marcaEdit); // envías la marca editada
      onClose(); // cerrar modal
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        
        <h2 className="text-xl font-bold mb-4">Editar Marca</h2>

        <p className="text-sm text-slate-500 mb-2">
          ID: {marca.id}
        </p>

        <input
          value={marcaEdit.descripcion}
          onChange={(e) =>
            setMarcaEdit({
              ...marcaEdit,
              descripcion: e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={EditarMar}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-cyan-600 text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>

      </div>
    </div>
  );
}