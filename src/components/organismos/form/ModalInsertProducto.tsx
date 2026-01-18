import { useEffect, useState } from "react";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useProductosStore } from "../../../store/ProductosStore";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
}

export default function ModalInsertProducto({ onClose }: Props) {
  const { dataempresa } = useEmpresaStore();
  const { insertarproductos } = useProductosStore();
  const { mostrarMarca, datamarca } = useMarcaStore();
  const { mostrarcategorias, datacategorias } = useCategoriasStore();

  const [marcaSeleccionada, setMarcaSeleccionada] = useState<number | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);

  const [form, setForm] = useState({
    descripcion: "",
    codigobarras: "",
    codigointerno: "",
    stock: "",
    stock_minimo: "",
    preciocompra: "",
    precioventa: "",
  });

  useEffect(() => {
    if (!dataempresa?.empresa?.id) return;

    mostrarMarca(dataempresa.empresa.id);
    mostrarcategorias(dataempresa.empresa.id);
  }, [dataempresa?.empresa?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!marcaSeleccionada || !categoriaSeleccionada) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Seleccione una marca y una categoría",
      });
      return;
    }

    await insertarproductos({
      _descripcion: form.descripcion,
      _codigo_barras: form.codigobarras,
      _codigo_interno: form.codigointerno,
      _id_marca: marcaSeleccionada,
      _id_categoria: categoriaSeleccionada,
      _stock: Number(form.stock),
      _stock_minimo: Number(form.stock_minimo),
      _precio_compra: Number(form.preciocompra),
      _precio_venta: Number(form.precioventa),
      _id_empresa: Number(dataempresa?.empresa?.id),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-xl">

        <h2 className="text-xl font-black mb-4">Nuevo Producto</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <input
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="col-span-2 border rounded-lg px-3 py-2"
            required
          />

          <input
            name="codigobarras"
            placeholder="Código de barras"
            value={form.codigobarras}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="codigointerno"
            placeholder="Código interno"
            value={form.codigointerno}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          />

        {/* MARCAS */}
        <div className="col-span-2">
        <label className="font-semibold mb-2 block">Marca</label>

        <select
            value={marcaSeleccionada ?? ""}
            onChange={(e) => setMarcaSeleccionada(Number(e.target.value))}
            className="
            w-full
            border
            rounded-lg
            px-3
            py-2
            bg-white
            text-gray-700
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
            "
            required
        >
            <option value="" disabled>
            Seleccione una marca
            </option>

            {datamarca.map((m) => (
            <option key={m.id} value={m.id}>
                {m.descripcion}
            </option>
            ))}
        </select>
        </div>


        {/* CATEGORÍAS */}
        <div className="col-span-2">
        <label className="font-semibold mb-2 block">Categoría</label>

        <select
            value={categoriaSeleccionada ?? ""}
            onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
            className="
            w-full
            border
            rounded-lg
            px-3
            py-2
            bg-white
            text-gray-700
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500
            "
            required
        >
            <option value="" disabled>
            Seleccione una categoría
            </option>

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
            value={form.stock}
            onChange={handleChange}
            type="number"
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="stock_minimo"
            placeholder="Stock mínimo"
            value={form.stock_minimo}
            onChange={handleChange}
            type="number"
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="preciocompra"
            placeholder="Precio compra"
            value={form.preciocompra}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border rounded-lg px-3 py-2"
          />

          <input
            name="precioventa"
            placeholder="Precio venta"
            value={form.precioventa}
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
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}