import { useEffect, useState } from "react";
import type { InsertarProductoDTO } from "../../../supabase/crudProductos";
import { UserAuth } from "../../../context/AuthContext";
import { useProductosStore } from "../../../store/ProductosStore";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { GrClose, GrSave, GrSearch, GrRotateLeft, GrFormDown, GrTag, GrBookmark } from "react-icons/gr";
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
  
  // Estados para buscadores y dropdowns
  const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
  const [showCateDropdown, setShowCateDropdown] = useState(false);
  const [busquedaMarca, setBusquedaMarca] = useState("");
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [selectedMarcaName, setSelectedMarcaName] = useState("Cargando...");
  const [selectedCateName, setSelectedCateName] = useState("Cargando...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!empresa?.empresa?.id) return;
    mostrarMarca(empresa.empresa.id);
    mostrarcategorias(empresa.empresa.id);
  }, [empresa?.empresa?.id]);

  // Sincronizar nombres iniciales cuando los datos de las tiendas estén listos
  useEffect(() => {
    const marca = datamarca.find(m => m.id === producto.idmarca);
    if (marca) setSelectedMarcaName(marca.descripcion);

    const cate = datacategorias.find(c => c.id === producto.id_categoria);
    if (cate) setSelectedCateName(cate.descripcion);
  }, [datamarca, datacategorias, producto]);

  // Filtrado lógico
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

  const selectMarca = (id: number, nombre: string) => {
    setMarcaSeleccionada(id);
    setSelectedMarcaName(nombre);
    setShowMarcaDropdown(false);
    setBusquedaMarca("");
  };

  const selectCategoria = (id: number, nombre: string) => {
    setCategoriaSeleccionada(id);
    setSelectedCateName(nombre);
    setShowCateDropdown(false);
    setBusquedaCategoria("");
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
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border-4 border-black p-3 font-black uppercase text-xs focus:bg-[#fee685]/20 outline-none transition-colors dark:bg-zinc-800 dark:text-white placeholder:text-gray-400";
  const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 flex items-center gap-1";
  const dropdownBoxStyles = "w-full border-4 border-black px-4 py-3 font-bold bg-white dark:bg-zinc-800 dark:text-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors dark:hover:bg-zinc-700 uppercase text-xs";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[95vh] overflow-y-auto relative">
        
        {/* HEADER */}
        <div className="sticky top-0 z-50 bg-[#fee685] border-b-4 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-black">
            Editar Producto
          </h2>
          <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
            <GrClose size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className={labelStyles}>Nombre del Producto <span className="text-red-500">(*)</span></label>
            <input name="descripcion" value={editProducto.descripcion} onChange={handleChange} className={inputStyles} required />
          </div>

          <div className="md:col-span-2">
            <label className={labelStyles}>Código Interno (SKU) <span className="text-red-500">(*)</span></label>
            <input name="codigointerno" value={editProducto.codigointerno} onChange={handleChange} className={inputStyles} required />
          </div>

          {/* BUSCADOR DE MARCA PERSONALIZADO */}
          <div className="space-y-2 relative">
            <label className={labelStyles}>Marca <GrTag className="w-3 h-3" /> <span className="text-red-500">(*)</span></label>
            <div 
              onClick={() => {setShowMarcaDropdown(!showMarcaDropdown); setShowCateDropdown(false)}} 
              className={dropdownBoxStyles}
            >
              <span className="text-black dark:text-white">{selectedMarcaName}</span>
              <GrFormDown className={`w-5 h-5 transition-transform ${showMarcaDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showMarcaDropdown && (
              <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-2 border-b-2 border-black bg-gray-50 dark:bg-zinc-800">
                  <div className="relative">
                    <GrSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      autoFocus 
                      type="text" 
                      placeholder="Filtrar marcas..." 
                      className="w-full pl-9 pr-4 py-2 border-4 border-black outline-none text-xs dark:bg-zinc-700 dark:text-white" 
                      value={busquedaMarca} 
                      onChange={(e) => setBusquedaMarca(e.target.value)} 
                    />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {marcasFiltradas.length > 0 ? (
                    marcasFiltradas.map((m) => (
                      <li 
                        key={m.id} 
                        onClick={() => selectMarca(m.id, m.descripcion)} 
                        className="px-4 py-3 hover:bg-[#fee685] cursor-pointer font-bold border-b border-gray-100 dark:border-zinc-700 transition-colors flex justify-between items-center group"
                      >
                        <span className="text-xs dark:text-white group-hover:text-black uppercase">{m.descripcion}</span>
                        <span className="text-[9px] bg-black text-white px-2 py-0.5">ID: {m.id}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 italic text-xs">No hay resultados</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* BUSCADOR DE CATEGORÍA PERSONALIZADO */}
          <div className="space-y-2 relative">
            <label className={labelStyles}>Categoría <GrBookmark className="w-3 h-3" /> <span className="text-red-500">(*)</span></label>
            <div 
              onClick={() => {setShowCateDropdown(!showCateDropdown); setShowMarcaDropdown(false)}} 
              className={dropdownBoxStyles}
            >
              <span className="text-black dark:text-white">{selectedCateName}</span>
              <GrFormDown className={`w-5 h-5 transition-transform ${showCateDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showCateDropdown && (
              <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-2 border-b-2 border-black bg-gray-50 dark:bg-zinc-800">
                  <div className="relative">
                    <GrSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      autoFocus 
                      type="text" 
                      placeholder="Filtrar categorías..." 
                      className="w-full pl-9 pr-4 py-2 border-4 border-black outline-none text-xs dark:bg-zinc-700 dark:text-white" 
                      value={busquedaCategoria} 
                      onChange={(e) => setBusquedaCategoria(e.target.value)} 
                    />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map((c) => (
                      <li 
                        key={c.id} 
                        onClick={() => selectCategoria(c.id, c.descripcion)} 
                        className="px-4 py-3 hover:bg-[#fee685] cursor-pointer font-bold border-b border-gray-100 dark:border-zinc-700 transition-colors flex justify-between items-center group"
                      >
                        <span className="text-xs dark:text-white group-hover:text-black uppercase">{c.descripcion}</span>
                        <span className="text-[9px] bg-black text-white px-2 py-0.5">ID: {c.id}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 italic text-xs">No hay resultados</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* STOCK */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className={labelStyles}>Stock Actual <span className="text-red-500">(*)</span></label>
              <input name="stock" type="number" value={editProducto.stock} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Stock Mínimo <span className="text-red-500">(*)</span></label>
              <input name="stock_minimo" type="number" value={editProducto.stock_minimo} onChange={handleChange} className={inputStyles} required />
            </div>
          </div>

          {/* PRECIOS */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
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
              className="flex-1 px-4 py-3 font-black uppercase border-4 border-black bg-white hover:bg-gray-100 transition-all text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !editProducto.descripcion || !editProducto.codigointerno}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase bg-yellow-400 hover:bg-yellow-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50"
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