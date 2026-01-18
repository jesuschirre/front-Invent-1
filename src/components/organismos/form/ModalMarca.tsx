import { useState } from "react";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";

interface Props {
  onClose: () => void;
}

export default function ModalMarca({ onClose }: Props) {
  const [descripcion, setDescripcion] = useState("");
  const { insertarMarca } = useMarcaStore();
  const { dataempresa } = useEmpresaStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) return;

    await insertarMarca({
      _descripcion: descripcion,
      _idempresa: dataempresa?.empresa?.id,
    });

    setDescripcion("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        <h2 className="text-xl font-black mb-4">Agregar Marca</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Descripción de la marca"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
            >
              Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}