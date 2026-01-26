import { useEffect, useState } from "react";
import CirImg from "../moleculas/CirImg";
import { UserAuth } from "../../context/AuthContext";
import { GrAdd, GrSearch, GrFormPrevious, GrFormNext } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { useProductosStore } from "../../store/ProductosStore";
import { type InsertarProductoDTO } from "../../supabase/crudProductos";
import ModalInsertProducto from "../organismos/form/ModalInsertProducto";
import EditarProductModal from "../organismos/form/EditarProductModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductosTemplate() {
  const { eliminarproductos, mostrarproductos, dataproductos } = useProductosStore();
  const { empresa } = UserAuth();
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false);
  const [productSeleccionado, setProductSeleccionado] = useState<InsertarProductoDTO | null>(null);

  // Estados para Buscador y Paginación
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  useEffect(() => {
    if (!empresa?.empresa?.id) return;
    mostrarproductos(empresa.empresa.id);
  }, [mostrarproductos, empresa]);

  // Lógica de Filtrado (Busca por descripción o código)
  const productosFiltrados = dataproductos.filter((p) =>
    p.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
    p.codigobarras?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Lógica de Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const currentTableData = productosFiltrados.slice(startIndex, startIndex + itemsPorPagina);


  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CirImg />
          <div className="px-4 py-1 bg-black text-white font-black text-xs uppercase tracking-widest">
            Inventario
          </div>
        </header>

        {/* HEADER DE PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">
              Productos
            </h1>
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-[0.2em]">
              Gestión de Stock / {productosFiltrados.length} Items Encontrados
            </p>
          </div>
          
          <button
            onClick={() => setOpenModalProduct(true)}
            className="flex items-center justify-center gap-2 bg-[#fee685] hover:bg-yellow-400 text-black px-8 py-4 border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all  active:shadow-none"
          >
            <GrAdd size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* BUSCADOR NEO-BRUTALISTA */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 p-2">
           <div className="bg-black text-white p-3 border-2 border-black">
              <GrSearch size={20} />
           </div>
           <input 
              type="text"
              placeholder="BUSCAR POR NOMBRE O CÓDIGO DE BARRAS..."
              className="w-full bg-transparent outline-none font-black uppercase text-sm dark:text-white placeholder:text-gray-400"
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
           />
        </div>

        {/* CONTENEDOR DE TABLA NATIVA */}
        <section className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fee685] border-b-4 border-black text-black">
                  <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-black">Producto</th>
                  <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-black">Cód. INTERNO</th>
                  <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-black text-center">Stock</th>
                  <th className="p-4 font-black uppercase text-xs tracking-widest border-r-2 border-black text-center">P. Venta</th>
                  <th className="p-4 font-black uppercase text-xs tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {currentTableData.length > 0 ? (
                  currentTableData.map((item) => (
                    <tr key={item.id} className="hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-colors">
                      <td className="p-4 border-r-2 border-black font-black uppercase dark:text-white">
                        {item.descripcion}
                      </td>
                      <td className="p-4 border-r-2 border-black font-bold text-gray-500 dark:text-gray-400">
                        {item.codigointerno || "---"}
                      </td>
                      <td className="p-4 border-r-2 border-black text-center">
                        <span className={`px-3 py-1 border-2 border-black font-black ${Number(item.stock) <= Number(item.stock_minimo) ? 'bg-red-400' : 'bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-black text-center font-black dark:text-white">
                        S/ {item.precioventa}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setProductSeleccionado(item);
                              setOpenModalEditProduct(true);
                            }}
                            className="p-2 border-2 border-black bg-white hover:bg-blue-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                          >
                            <GoPencil size={18} />
                          </button>
                          <button
                            onClick={() => eliminarproductos(item.id)}
                            className="p-2 border-2 border-black bg-white hover:bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                          >
                            <FaRegTrashAlt size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center font-black uppercase text-gray-400 italic">
                      No se encontraron productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINADOR NEO-BRUTALISTA */}
          <div className="bg-[#fee685] dark:bg-zinc-800 px-6 py-4 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-black uppercase text-black dark:text-white">
              Mostrando {productosFiltrados.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPorPagina, productosFiltrados.length)} de {productosFiltrados.length} registros
            </p>

            <div className="flex items-center gap-2">
              <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual(prev => prev - 1)}
                  className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPaginaActual(page)}
                      className={`w-10 h-10 border-2 border-black font-black text-sm transition-all ${
                        paginaActual === page 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>
              <button
                  disabled={paginaActual === totalPaginas || totalPaginas === 0}
                  onClick={() => setPaginaActual(prev => prev + 1)}
                  className="p-2 border-2 border-black bg-white dark:bg-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 dark:text-white" />
              </button>
            </div>
          </div>
        </section>

        {/* MODALES */}
        {openModalProduct && <ModalInsertProducto onClose={() => setOpenModalProduct(false)} />}
        {openModalEditProduct && productSeleccionado && (
          <EditarProductModal
            producto={productSeleccionado}
            onClose={() => {
              setOpenModalEditProduct(false);
              setProductSeleccionado(null);
            }}
          />
        )}
      </div>
    </div>
  );
}