import { useEffect, useState } from "react";
import type { InsertarProductoDTO } from "../../../supabase/crudProductos";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useProductosStore } from "../../../store/ProductosStore";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import Swal from "sweetalert2"

interface Props {
  producto: InsertarProductoDTO;
  onClose: () => void;
}

export default function EditarProductModal({ producto, onClose }: Props) {
  const { dataempresa } = useEmpresaStore();
  const { editarproductos } = useProductosStore();
  const { mostrarMarca, datamarca } = useMarcaStore();
  const { mostrarcategorias, datacategorias } = useCategoriasStore();

  /* =========================
     ESTADO DEL FORMULARIO
  ========================== */
  const [editProducto, setEditProducto] =
    useState<InsertarProductoDTO>(producto);

  const [marcaSeleccionada, setMarcaSeleccionada] =
    useState<number>(producto.idmarca);

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<number>(producto.id_categoria);

  /* =========================
     CARGAR MARCAS Y CATEGORÍAS
  ========================== */
  useEffect(() => {
    if (!dataempresa?.empresa?.id) return;

    mostrarMarca(dataempresa.empresa.id);
    mostrarcategorias(dataempresa.empresa.id);
  }, [dataempresa?.empresa?.id]);

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setEditProducto({
      ...editProducto,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await editarproductos({
      ...editProducto,
      idmarca: marcaSeleccionada,
      id_categoria: categoriaSeleccionada,
    });

    onClose();

    if (response){
        await Swal.fire({
        icon: "success",
        title: "Producto editado correctamente",
        text: "La información fue actualizada.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-xl">

        <h2 className="text-xl font-black mb-4">Editar Producto</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <input
            name="descripcion"
            placeholder="Descripción"
            value={editProducto.descripcion}
            onChange={handleChange}
            className="col-span-2 border rounded-lg px-3 py-2"
            required
          />

          <input
            name="codigobarras"
            placeholder="Código de barras"
            value={editProducto.codigobarras}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="codigointerno"
            placeholder="Código interno"
            value={editProducto.codigointerno}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          {/* MARCA */}
          <div className="col-span-2">
            <label className="font-semibold mb-2 block">Marca</label>
            <select
              value={marcaSeleccionada}
              onChange={(e) => setMarcaSeleccionada(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              {datamarca.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORÍA */}
          <div className="col-span-2">
            <label className="font-semibold mb-2 block">Categoría</label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              {datacategorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descripcion}
                </option>
              ))}
            </select>
          </div>

          <input
            name="stock"
            placeholder="Stock"
            value={editProducto.stock}
            onChange={handleChange}
            type="number"
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="stock_minimo"
            placeholder="Stock mínimo"
            value={editProducto.stock_minimo}
            onChange={handleChange}
            type="number"
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="preciocompra"
            placeholder="Precio compra"
            value={editProducto.preciocompra}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="precioventa"
            placeholder="Precio venta"
            value={editProducto.precioventa}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border rounded-lg px-3 py-2"
          />

          <div className="col-span-2 flex justify-end gap-3 mt-4">
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
              Guardar cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}