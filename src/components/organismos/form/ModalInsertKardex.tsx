import { useEffect, useState } from "react";
import { Search, X, ChevronDown, Package, Info } from 'lucide-react';
import { InsertarKardex } from "../../../supabase/crudKardex";
import { useProductosStore } from "../../../store/ProductosStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { ObtenerIdUsuario } from "../../../supabase/GlobalSupabase";
import { GrRotateLeft } from "react-icons/gr";

interface Props {
  onClose: () => void;
}

export default function ModalInsertKardex({ onClose }: Props) {
  const { dataempresa } = useEmpresaStore();
  const { mostrarproductos, dataproductos } = useProductosStore();

  const [form, setForm] = useState({
    tipo: "entrada",
    id_producto: "",
    cantidad: "",
    detalles: ""
  });

  // Estados para el buscador de productos
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("Seleccione un producto");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataempresa?.empresa?.id) return;
    mostrarproductos(dataempresa.empresa.id);
  }, [dataempresa?.empresa?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const selectProducto = (id: string, descripcion: string) => {
    setForm({ ...form, id_producto: id });
    setSelectedProductName(descripcion);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const filteredProductos = dataproductos.filter((p: any) =>
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!dataempresa?.empresa?.id || !form.id_producto) return;

    const id_usuario = await ObtenerIdUsuario();
    if (!id_usuario) return;

    const kardex = {
      fecha: new Date().toISOString().split("T")[0],
      tipo: form.tipo,
      cantidad: Number(form.cantidad),
      id_producto: Number(form.id_producto),
      id_empresa: dataempresa.empresa.id,
      id_usuario: id_usuario,
      detalles: form.detalles
    };

    try {
      await InsertarKardex(kardex);
      onClose();
    } catch (error: any) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black w-full max-w-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header con estilo amarillo */}
        <div className="bg-[#fee685] border-b-4 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            Nuevo Movimiento
          </h2>
          <button 
            onClick={onClose}
            className="hover:rotate-90 transition-transform p-1 border-2 border-black bg-white hover:bg-red-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Movimiento */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase flex items-center gap-1 dark:text-white">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border-4 border-black px-3 py-2 font-bold focus:bg-yellow-50 dark:focus:bg-yellow-500
                           outline-none appearance-none cursor-pointer dark:bg-zinc-800 dark:text-white"
              >
                <option value="entrada">🟢 Entrada</option>
                <option value="salida">🔴 Salida</option>
              </select>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase flex items-cente gap-1 dark:text-white">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                placeholder="0.00"
                value={form.cantidad}
                onChange={handleChange}
                min="0.1"
                step="any"
                required
                className="w-full border-4 border-black px-3 py-2 font-bold focus:bg-yellow-50 dark:focus:bg-yellow-500
                          outline-none appearance-none dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Buscador de Producto */}
          <div className="space-y-2 relative">
            <label className="text-sm font-black uppercase flex items-center gap-1 text-black dark:text-white">
              Producto <Package className="w-3 h-3" />
            </label>
            
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full border-4 border-black px-4 py-3 font-bold bg-white dark:bg-zinc-800 
                       dark:text-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors
                       dark:hover:bg-yellow-500"
            >
              <span className={form.id_producto ? "text-black dark:text-white" : "text-gray-400"}>
                {selectedProductName}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown del Buscador */}
            {showDropdown && (
              <div className="absolute z-10 top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-2 border-b-2 border-black bg-gray-50 dark:bg-zinc-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Filtrar productos..."
                      className="w-full pl-9 pr-4 py-2 border-4 border-black outline-none text-sm dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <ul className="max-h-56 overflow-y-auto">
                  {filteredProductos.length > 0 ? (
                    filteredProductos.map((p: any) => (
                      <li
                        key={p.id}
                        onClick={() => selectProducto(p.id, p.descripcion)}
                        className="px-4 py-3 hover:bg-[#fee685] cursor-pointer font-bold border-b border-gray-100 dark:border-zinc-700 transition-colors flex justify-between items-center group"
                      >
                        <span className="dark:text-white group-hover:text-black">{p.descripcion}</span>
                        <span className="text-[10px] bg-black text-white px-2 py-1 rounded">ID: {p.id}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 italic dark:text-white">No se hallaron resultados</li>
                  )}
                </ul> 
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase flex items-center gap-1 dark:text-white">
              Detalles <Info className="w-3 h-3" />
            </label>
            <textarea
              name="detalles"
              placeholder="Ej: Ajuste por inventario inicial..."
              value={form.detalles}
              onChange={handleChange}
              rows={3}
              className="w-full border-4 border-black px-3 py-2 font-medium focus:bg-yellow-50 dark:focus:bg-yellow-500
                         outline-none dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 font-black uppercase border-4 border-black bg-white hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.id_producto  || !loading}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase bg-yellow-400 hover:bg-yellow-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading && <GrRotateLeft className="animate-spin" />}
              {loading ? "Guardando..." : "Guardar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}