import { useState } from "react";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
interface Props {
  onClose: () => void;
}
export default function ModalInsertCategoria({ onClose }: Props) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [color, setColor] = useState("");
    const {insertarcategorias} = useCategoriasStore();
    const { dataempresa } = useEmpresaStore();
    const colores = [
    "#22d3ee",
    "#0ea5e9",
    "#22c55e",
    "#facc15",
    "#f97316",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    ];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!descripcion.trim()) return;

        await insertarcategorias({
            _nombre: nombre,
            _descripcion: descripcion,
            _idempresa: dataempresa?.empresa?.id,
            _color: color
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
            placeholder="Nombre de la marca"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Descripción de la marca"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div className="grid grid-cols-8 gap-2">
            {colores.map((c) => (
                <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${
                    color === c ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                />
            ))}
          </div>
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
  )
}
