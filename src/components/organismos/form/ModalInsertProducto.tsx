import { useEffect, useState } from "react";
import { UserAuth } from "../../../context/AuthContext";
import { useProductosStore } from "../../../store/ProductosStore";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { GrClose, GrRotateLeft, GrSearch, GrFormDown, GrTag, GrBookmark } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
}

export default function ModalInsertProducto({ onClose }: Props) {
  const { empresa } = UserAuth();
  const { insertarproductos } = useProductosStore();
  const { mostrarMarca, datamarca } = useMarcaStore();
  const { mostrarcategorias, datacategorias } = useCategoriasStore();

  const [marcaSeleccionada, setMarcaSeleccionada] = useState<number | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para los dropdowns personalizados
  const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
  const [showCateDropdown, setShowCateDropdown] = useState(false);
  const [searchMarca, setSearchMarca] = useState("");
  const [searchCate, setSearchCate] = useState("");
  const [selectedMarcaName, setSelectedMarcaName] = useState("Seleccionar marca...");
  const [selectedCateName, setSelectedCateName] = useState("Seleccionar categoría...");

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
    if (!empresa?.empresa?.id) return;
    mostrarMarca(empresa.empresa.id);
    mostrarcategorias(empresa.empresa.id);
  }, [empresa?.empresa?.id]);

  // Filtrado de listas
  const marcasFiltradas = datamarca.filter((m) =>
    m.descripcion.toLowerCase().includes(searchMarca.toLowerCase())
  );

  const categoriasFiltradas = datacategorias.filter((c) =>
    c.descripcion.toLowerCase().includes(searchCate.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectMarca = (id: number, nombre: string) => {
    setMarcaSeleccionada(id);
    setSelectedMarcaName(nombre);
    setShowMarcaDropdown(false);
    setSearchMarca("");
  };

  const selectCategoria = (id: number, nombre: string) => {
    setCategoriaSeleccionada(id);
    setSelectedCateName(nombre);
    setShowCateDropdown(false);
    setSearchCate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!marcaSeleccionada || !categoriaSeleccionada) {
      Swal.fire({
        icon: "warning",
        title: "DATOS INCOMPLETOS",
        text: "Seleccione una marca y una categoría obligatoriamente",
        confirmButtonColor: "#000000",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await insertarproductos({
        _descripcion: form.descripcion,
        _codigo_barras: form.codigobarras,
        _codigo_interno: form.codigointerno,
        _id_marca: marcaSeleccionada,
        _id_categoria: categoriaSeleccionada,
        _stock: Number(form.stock),
        _stock_minimo: Number(form.stock_minimo),
        _precio_compra: Number(form.preciocompra),
        _precio_venta: Number(form.precioventa),
        _id_empresa: Number(empresa?.empresa?.id),
      });

      onClose();
      if (res) {
        await Swal.fire({
          icon: "success",
          title: "INSERTADO",
          text: "El Producto fue introducido Satisfactoriamente",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border-4 border-black p-3 font-black uppercase text-xs focus:bg-[#fee685]/20 outline-none transition-colors dark:bg-zinc-800 dark:text-white placeholder:text-gray-400";
  const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 flex items-center gap-1";
  const dropdownBoxStyles = "w-full border-4 border-black px-4 py-3 font-bold bg-white dark:bg-zinc-800 dark:text-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors dark:hover:bg-zinc-700 uppercase text-xs";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* HEADER */}
        <div className="sticky top-0 z-50 bg-[#fee685] border-b-4 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-black">Nuevo Producto</h2>
          <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
            <GrClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className={labelStyles}>Nombre General <span className="text-red-500">(*)</span></label>
            <input name="descripcion" value={form.descripcion} onChange={handleChange} className={inputStyles} required />
          </div>

          <div className="md:col-span-2">
            <label className={labelStyles}>SKU / Código Interno <span className="text-red-500">(*)</span></label>
            <input name="codigointerno" value={form.codigointerno} onChange={handleChange} className={inputStyles} required />
          </div>

          {/* BUSCADOR DE MARCA PERSONALIZADO */}
          <div className="space-y-2 relative">
            <label className={labelStyles}>Marca <GrTag className="w-3 h-3" /> <span className="text-red-500">(*)</span></label>
            <div onClick={() => {setShowMarcaDropdown(!showMarcaDropdown); setShowCateDropdown(false)}} className={dropdownBoxStyles}>
              <span className={marcaSeleccionada ? "text-black dark:text-white" : "text-gray-400"}>{selectedMarcaName}</span>
              <GrFormDown className={`w-5 h-5 transition-transform ${showMarcaDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showMarcaDropdown && (
              <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-2 border-b-2 border-black bg-gray-50 dark:bg-zinc-800">
                  <div className="relative">
                    <GrSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input autoFocus type="text" placeholder="Filtrar marcas..." className="w-full pl-9 pr-4 py-2 border-4 border-black outline-none text-xs dark:bg-zinc-700 dark:text-white" value={searchMarca} onChange={(e) => setSearchMarca(e.target.value)} />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {marcasFiltradas.length > 0 ? (
                    marcasFiltradas.map((m) => (
                      <li key={m.id} onClick={() => selectMarca(m.id, m.descripcion)} className="px-4 py-3 hover:bg-[#fee685] cursor-pointer font-bold border-b border-gray-100 dark:border-zinc-700 transition-colors flex justify-between items-center group">
                        <span className="text-xs dark:text-white group-hover:text-black uppercase">{m.descripcion}</span>
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
            <div onClick={() => {setShowCateDropdown(!showCateDropdown); setShowMarcaDropdown(false)}} className={dropdownBoxStyles}>
              <span className={categoriaSeleccionada ? "text-black dark:text-white" : "text-gray-400"}>{selectedCateName}</span>
              <GrFormDown className={`w-5 h-5 transition-transform ${showCateDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showCateDropdown && (
              <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-2 border-b-2 border-black bg-gray-50 dark:bg-zinc-800">
                  <div className="relative">
                    <GrSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input autoFocus type="text" placeholder="Filtrar categorías..." className="w-full pl-9 pr-4 py-2 border-4 border-black outline-none text-xs dark:bg-zinc-700 dark:text-white" value={searchCate} onChange={(e) => setSearchCate(e.target.value)} />
                  </div>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map((c) => (
                      <li key={c.id} onClick={() => selectCategoria(c.id, c.descripcion)} className="px-4 py-3 hover:bg-[#fee685] cursor-pointer font-bold border-b border-gray-100 dark:border-zinc-700 transition-colors flex justify-between items-center group">
                        <span className="text-xs dark:text-white group-hover:text-black uppercase">{c.descripcion}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 italic text-xs">No hay resultados</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* STOCK Y PRECIOS */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className={labelStyles}>Stock Act.</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Mínimo</label>
              <input name="stock_minimo" type="number" value={form.stock_minimo} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Costo</label>
              <input name="preciocompra" type="number" step="0.01" value={form.preciocompra} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Venta</label>
              <input name="precioventa" type="number" step="0.01" value={form.precioventa} onChange={handleChange} className={inputStyles} required />
            </div>
          </div>

          {/* ACCIONES */}
          <div className="md:col-span-2 flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-zinc-900 py-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 font-black uppercase border-4 border-black bg-white hover:bg-gray-100 transition-all">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !marcaSeleccionada || !categoriaSeleccionada || !form.descripcion}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase bg-yellow-400 hover:bg-yellow-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <GrRotateLeft className="animate-spin" /> : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}