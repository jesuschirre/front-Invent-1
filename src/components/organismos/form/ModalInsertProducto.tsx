import { useEffect, useState } from "react";
import { UserAuth } from "../../../context/AuthContext";
import { useProductosStore } from "../../../store/ProductosStore";
import { useMarcaStore } from "../../../store/MarcaStore";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { GrClose, GrRotateLeft, GrSearch } from "react-icons/gr";
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

  // Estados para los buscadores
  const [busquedaMarca, setBusquedaMarca] = useState("");
  const [busquedaCategoria, setBusquedaCategoria] = useState("");

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

  // Filtrado lógico
  const marcasFiltradas = datamarca.filter((m) =>
    m.descripcion.toLowerCase().includes(busquedaMarca.toLowerCase())
  );

  const categoriasFiltradas = datacategorias.filter((c) =>
    c.descripcion.toLowerCase().includes(busquedaCategoria.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (!marcaSeleccionada || !categoriaSeleccionada) {
        Swal.fire({
          icon: "warning",
          title: "DATOS INCOMPLETOS",
          text: "Seleccione una marca y una categoría obligatoriamente",
          confirmButtonColor: "#000000",
        });
        return;
      }

      setLoading(true);

      const res =await insertarproductos({
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
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No se pudo guardar el producto",
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-[#fee685] border-b-4 border-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black">
              Nuevo Producto
            </h2>
          </div>
          <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
            <GrClose size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className={labelStyles}>Nombre General <span className="text-red-500">(*)</span> </label>
            <input name="descripcion" placeholder="Ej: Camiseta Algodón Premium XL" value={form.descripcion} onChange={handleChange} className={inputStyles} required />
          </div>

          <div className="md:col-span-2">
            <label className={labelStyles}>SKU / Código Interno <span className="text-red-500">(*)</span> </label>
            <input name="codigointerno" placeholder="PROD-001" value={form.codigointerno} onChange={handleChange} className={inputStyles} />
          </div>

          {/* BUSCADOR MARCA */}
          <div className="flex flex-col gap-2">
            <label className={labelStyles}>Marca <span className="text-red-500">(*)</span> </label>
            <div className="relative group">
               <div className="absolute left-3 top-3 text-black dark:text-white z-10"><GrSearch size={14}/></div>
               <input 
                type="text" 
                placeholder="BUSCAR MARCA..." 
                className={`${inputStyles} pl-10 mb-1 !border-b-2`} 
                value={busquedaMarca}
                onChange={(e) => setBusquedaMarca(e.target.value)}
               />
               <select
                value={marcaSeleccionada ?? ""}
                onChange={(e) => setMarcaSeleccionada(Number(e.target.value))}
                className={`${inputStyles} appearance-none cursor-pointer h-32`}
                required
                size={4}
              >
                {marcasFiltradas.length > 0 ? (
                  marcasFiltradas.map((m) => (
                    <option key={m.id} value={m.id} className="p-2 font-bold border-b border-gray-100 dark:border-zinc-700 checked:bg-[#fee685] checked:text-black">
                      {m.descripcion}
                    </option>
                  ))
                ) : (
                  <option disabled className="p-2">No hay resultados</option>
                )}
              </select>
            </div>
          </div>

          {/* BUSCADOR CATEGORIA */}
          <div className="flex flex-col gap-2">
            <label className={labelStyles}>Categoría <span className="text-red-500">(*)</span> </label>
            <div className="relative group">
               <div className="absolute left-3 top-3 text-black dark:text-white z-10"><GrSearch size={14}/></div>
               <input 
                type="text" 
                placeholder="BUSCAR CATEGORÍA..." 
                className={`${inputStyles} pl-10 mb-1 !border-b-2`} 
                value={busquedaCategoria}
                onChange={(e) => setBusquedaCategoria(e.target.value)}
               />
               <select
                value={categoriaSeleccionada ?? ""}
                onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
                className={`${inputStyles} appearance-none cursor-pointer h-32`}
                required
                size={4}
              >
                {categoriasFiltradas.length > 0 ? (
                  categoriasFiltradas.map((c) => (
                    <option key={c.id} value={c.id} className="p-2 font-bold border-b border-gray-100 dark:border-zinc-700 checked:bg-[#fee685] checked:text-black">
                      {c.descripcion}
                    </option>
                  ))
                ) : (
                  <option disabled className="p-2">No hay resultados</option>
                )}
              </select>
            </div>
          </div>

          {/* STOCK Y PRECIOS */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyles}>Stock Act. <span className="text-red-500">(*)</span></label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Mínimo <span className="text-red-500">(*)</span></label>
              <input name="stock_minimo" type="number" value={form.stock_minimo} onChange={handleChange} className={inputStyles} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyles}>Costo <span className="text-red-500">(*)</span></label>
              <input name="preciocompra" type="number" step="0.01" value={form.preciocompra} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
              <label className={labelStyles}>Venta <span className="text-red-500">(*)</span></label>
              <input name="precioventa" type="number" step="0.01" value={form.precioventa} onChange={handleChange} className={inputStyles} required />
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
              disabled={ !form.descripcion || !form.codigointerno || !form.stock
                          || !form.stock_minimo || !form.preciocompra || !form.precioventa || loading}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
              bg-yellow-400 hover:bg-yellow-500 
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-none transition-all flex justify-center items-center gap-2 
              disabled:opacity-50"
            >
              {loading && <GrRotateLeft className="animate-spin" />}
              {loading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}