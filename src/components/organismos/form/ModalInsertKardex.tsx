import { useEffect, useState } from "react";
import { Search, X, ChevronDown, Package, Info } from 'lucide-react';
import { InsertarKardex } from "../../../supabase/crudKardex";
import { useProductosStore } from "../../../store/ProductosStore";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { ObtenerIdUsuario } from "../../../supabase/GlobalSupabase";
import { GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
  onSuccess?: () => void; // Nueva prop para avisar que hubo un insert exitoso
}

export default function ModalInsertKardex({ onClose, onSuccess }: Props) {
  const { dataempresa } = useEmpresaStore();
  const { mostrarproductos, dataproductos } = useProductosStore();

  const [form, setForm] = useState({
    tipo: "entrada",
    id_producto: "",
    cantidad: "",
    detalles: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("Seleccione un producto");
  const [loading, setLoading] = useState(false);

  // Cargar productos al iniciar
  useEffect(() => {
    if (dataempresa?.empresa?.id) {
      mostrarproductos(dataempresa.empresa.id);
    }
  }, [dataempresa?.empresa?.id, mostrarproductos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const selectProducto = (id: string, descripcion: string) => {
    setForm(prev => ({ ...prev, id_producto: id }));
    setSelectedProductName(descripcion);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const filteredProductos = dataproductos.filter((p: any) =>
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataempresa?.empresa?.id || !form.id_producto) return;

    setLoading(true);
    try {
      const id_usuario = await ObtenerIdUsuario();
      if (!id_usuario) throw new Error("No se pudo obtener el usuario");

      const kardex = {
        _fecha: new Date().toISOString().split("T")[0],
        _tipo: form.tipo,
        _cantidad: Number(form.cantidad),
        _id_producto: Number(form.id_producto),
        _id_empresa: dataempresa.empresa.id,
        _id_usuario: id_usuario,
        _detalles: form.detalles
      };

      const result = await InsertarKardex(kardex);

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Movimiento registrado",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: "top-end"
        });
        
        if (onSuccess) onSuccess(); // Disparamos la recarga de la tabla principal
        onClose();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo insertar el registro"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()} // Cierra al hacer clic fuera
    >
      <div className="bg-white dark:bg-zinc-900 border-4 border-black w-full max-w-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
        
        <div className="bg-[#fee685] border-b-4 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">Nuevo Movimiento</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform p-1 border-2 border-black bg-white hover:bg-red-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase dark:text-white">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border-4 border-black px-3 py-2 font-bold focus:bg-yellow-50 dark:bg-zinc-800 dark:text-white outline-none appearance-none cursor-pointer"
              >
                <option value="entrada">🟢 Entrada</option>
                <option value="salida">🔴 Salida</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase dark:text-white">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                placeholder="0.00"
                value={form.cantidad}
                onChange={handleChange}
                min="0.01"
                step="any"
                required
                className="w-full border-4 border-black px-3 py-2 font-bold focus:bg-yellow-50 dark:bg-zinc-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-black uppercase flex items-center gap-1 dark:text-white">
              Producto <Package className="w-3 h-3" />
            </label>
            
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full border-4 border-black px-4 py-3 font-bold bg-white dark:bg-zinc-800 dark:text-white flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <span className={form.id_producto ? "" : "text-gray-400"}>{selectedProductName}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showDropdown && (
              <div className="absolute z-10 top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-2 border-b-2 border-black bg-gray-50 dark:bg-zinc-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Filtrar productos..."
                      className="w-full pl-9 pr-4 py-2 border-4 border-black outline-none text-sm dark:bg-zinc-700 dark:text-white"
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
                        className="px-4 py-3 hover:bg-[#fee685] hover:text-black cursor-pointer font-bold border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center"
                      >
                        <span>{p.descripcion}</span>
                        <span className="text-[10px] bg-black text-white px-2 py-1">ID: {p.id}</span>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500 italic">No hay resultados</li>
                  )}
                </ul> 
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase dark:text-white">Detalles <Info className="w-3 h-3" /></label>
            <textarea
              name="detalles"
              placeholder="Ej: Ajuste de stock..."
              value={form.detalles}
              onChange={handleChange}
              rows={3}
              className="w-full border-4 border-black px-3 py-2 font-medium focus:bg-yellow-50 dark:bg-zinc-800 dark:text-white outline-none"
            />
          </div>

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
              disabled={!form.id_producto || loading}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase bg-yellow-400 hover:bg-yellow-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <GrRotateLeft className="animate-spin" /> : "Guardar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}