import { useEffect, useState } from "react";
import type { InsertarProductoDTO } from "../../../supabase/crudProductos";
import { UserAuth } from "../../../context/AuthContext";
import { useProductosStore } from "../../../store/ProductosStore";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { GrClose, GrSave, GrSearch, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  producto: InsertarProductoDTO;
  onClose: () => void;
}

export default function EditarProductModal({ producto, onClose }: Props) {
  const { empresa } = UserAuth();
  const { editarproductos } = useProductosStore();
  const { mostrarMarca, datamarca } = useMarcaStore();
  const { mostrarcategorias, datacategorias } = useCategoriasStore();

  const [editProducto, setEditProducto] = useState<InsertarProductoDTO>(producto);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<number>(producto.idmarca);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>(producto.id_categoria);
  
  // Estados para buscadores
  const [busquedaMarca, setBusquedaMarca] = useState("");
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!empresa?.empresa?.id) return;
    mostrarMarca(empresa.empresa.id);
    mostrarcategorias(empresa.empresa.id);
  }, [empresa?.empresa?.id]);

  // Filtrado
  const marcasFiltradas = datamarca.filter((m) =>
    m.descripcion.toLowerCase().includes(busquedaMarca.toLowerCase())
  );
  const categoriasFiltradas = datacategorias.filter((c) =>
    c.descripcion.toLowerCase().includes(busquedaCategoria.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditProducto({
      ...editProducto,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await editarproductos({
        ...editProducto,
        idmarca: marcaSeleccionada,
        id_categoria: categoriaSeleccionada,
      });

      onClose();
      if (response) {
        await Swal.fire({
          icon: "success",
          title: "¡ACTUALIZADO!",
          text: "La información del producto se sincronizó correctamente.",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No se pudo actualizar el producto",
        confirmButtonColor: "#000000",
      });
      onClose();
    } finally {
      setLoading(false);
    }

  };

  const inputStyles = "w-full border-4 border-black p-2 font-black uppercase text-xs focus:bg-[#fee685]/20 outline-none transition-colors dark:bg-zinc-800 dark:text-white placeholder:text-gray-400";
  const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 block";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[95vh] overflow-y-auto relative">
        
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-[#fee685] border-b-4 border-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black">
              Editar Producto
            </h2>
          </div>
          <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
            <GrClose size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className={labelStyles}>Nombre del Producto <span className="text-red-500">(*)</span></label>
            <input name="descripcion" value={editProducto.descripcion} onChange={handleChange} className={inputStyles} required />
          </div>

          <div className=" md:col-span-2">
            <label className={labelStyles}>Código Interno (SKU) <span className="text-red-500">(*)</span></label>
            <input name="codigointerno" value={editProducto.codigointerno} onChange={handleChange} className={inputStyles} />
          </div>

          {/* BUSCADOR MARCA */}
          <div className="flex flex-col gap-1">
            <label className={labelStyles}>Marca <span className="text-red-500">(*)</span></label>
            <div className="relative">
              <div className="absolute left-2 top-2.5 text-black dark:text-white z-10"><GrSearch size={12}/></div>
              <input 
                type="text" 
                placeholder="BUSCAR..." 
                className={`${inputStyles} pl-8`} 
                value={busquedaMarca}
                onChange={(e) => setBusquedaMarca(e.target.value)}
              />
              <select
                value={marcaSeleccionada}
                onChange={(e) => setMarcaSeleccionada(Number(e.target.value))}
                className={`${inputStyles} appearance-none cursor-pointer`}
                required
                size={3}
              >
                {marcasFiltradas.map((m) => (
                  <option key={m.id} value={m.id} className="p-1">{m.descripcion}</option>
                ))}
              </select>
            </div>
          </div>

          {/* BUSCADOR CATEGORIA */}
          <div className="flex flex-col gap-1">
            <label className={labelStyles}>Categoría <span className="text-red-500">(*)</span></label>
            <div className="relative">
              <div className="absolute left-2 top-2.5 text-black dark:text-white z-10"><GrSearch size={12}/></div>
              <input 
                type="text" 
                placeholder="BUSCAR..." 
                className={`${inputStyles} pl-8`} 
                value={busquedaCategoria}
                onChange={(e) => setBusquedaCategoria(e.target.value)}
              />
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
                className={`${inputStyles} appearance-none cursor-pointer`}
                required
                size={3}
              >
                {categoriasFiltradas.map((c) => (
                  <option key={c.id} value={c.id} className="p-1">{c.descripcion}</option>
                ))}
              </select>
            </div>
          </div>

          {/* STOCK */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyles}>Stock Actual <span className="text-red-500">(*)</span></label>
              <input name="stock" type="number" value={editProducto.stock} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Stock Mínimo <span className="text-red-500">(*)</span> </label>
              <input name="stock_minimo" type="number" value={editProducto.stock_minimo} onChange={handleChange} className={inputStyles} required />
            </div>
          </div>

          {/* PRECIOS */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyles}>Precio Compra <span className="text-red-500">(*)</span></label>
              <input name="preciocompra" type="number" step="0.01" value={editProducto.preciocompra} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Precio Venta <span className="text-red-500">(*)</span></label>
              <input name="precioventa" type="number" step="0.01" value={editProducto.precioventa} onChange={handleChange} className={inputStyles} required />
            </div>
          </div>

          {/* ACCIONES */}
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
              disabled={ !editProducto.descripcion || !editProducto.codigointerno || !editProducto.stock
                          || !editProducto.stock_minimo || !editProducto.preciocompra || !editProducto.precioventa || loading}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
              bg-yellow-400 hover:bg-yellow-500 
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-none transition-all flex justify-center items-center gap-2 
              disabled:opacity-50"
            >
              {loading ? <GrRotateLeft className="animate-spin" /> : <GrSave size={20} />}
              <span>{loading ? "Sincronizando..." : "Guardar Cambios"}</span>
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}