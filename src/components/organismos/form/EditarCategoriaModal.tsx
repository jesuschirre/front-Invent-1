import type { InterfaceCatego } from "../../../supabase/crudCategorias";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { useState } from "react";

interface Props {
  categoria: InterfaceCatego;
  onClose: () => void;
}

export default function EditarCategoriaModal({ categoria, onClose }: Props) {
  const { editarcategoria } = useCategoriasStore();

  const [cateEdit, setCatEdit] = useState<InterfaceCatego>(categoria);
  const [color, setColor] = useState(categoria.color ?? "");
  const [loading, setLoading] = useState(false);

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

  const EditarCategoria = async () => {
    setLoading(true);

    await editarcategoria({
      ...cateEdit,
      color,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">

        <h2 className="text-xl font-bold mb-4">Editar Categoría</h2>

        <p className="text-sm text-slate-500 mb-2">
          ID: {cateEdit.id}
        </p>

        {/* NOMBRE */}
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={cateEdit.nombre}
          onChange={(e) =>
            setCatEdit({
              ...cateEdit,
              nombre: e.target.value,
            })
          }
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        {/* DESCRIPCIÓN */}
        <input
          type="text"
          placeholder="Descripción"
          value={cateEdit.descripcion}
          onChange={(e) =>
            setCatEdit({
              ...cateEdit,
              descripcion: e.target.value,
            })
          }
          className="w-full border rounded-lg px-4 py-2 mb-4"
        />

        {/* COLORES */}
        <div className="grid grid-cols-8 gap-2 mb-4">
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

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={EditarCategoria}
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