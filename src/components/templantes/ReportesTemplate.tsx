import { useEffect, useState } from "react";
import { useProductosStore } from "../../store/ProductosStore";
import { UserAuth } from '../../context/AuthContext';
import { generarPDF } from "../../utils/pdf";
import { 
  FileText, 
  Calendar, 
  Package, 
  Download, 
  ClipboardList, 
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import {
  ReporteInventarioActual,
  ReporteMovimientos,
  ReporteKardexProducto
} from "../../supabase/crudReportes";

export default function ReportesTemplate() {
  const { empresa } = UserAuth();
  const { mostrarproductos, dataproductos } = useProductosStore();

  const [inventario, setInventario] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [idProducto, setIdProducto] = useState("");

  // ESTADOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const cargarInventario = async () => {
      if (!empresa?.empresa?.id) return;
      setLoading(true);
      const data = await ReporteInventarioActual(empresa.empresa.id);
      setInventario(data || []);
      setLoading(false);
    };
    cargarInventario();
  }, [empresa?.empresa?.id]);

  useEffect(() => {
    if (!empresa?.empresa?.id) return;
    mostrarproductos(empresa.empresa.id);
  }, [empresa?.empresa?.id]);

  // Lógica de cálculo de paginación para la vista previa
  const totalPages = Math.ceil(inventario.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTableData = inventario.slice(startIndex, startIndex + rowsPerPage);

  const exportarInventarioPDF = () => {
    if (inventario.length === 0) return;
    const columnas = ["Producto", "Stock"];
    const filas = inventario.map((p) => [p.descripcion, p.stock.toString()]);
    generarPDF(`Reporte Inventario - ${empresa?.empresa?.nombre}`, columnas, filas);
  };

  const exportarMovimientosFecha = async () => {
    if (!fechaInicio || !fechaFinal) return;
    const data = await ReporteMovimientos(Number(empresa?.empresa?.id), fechaInicio, fechaFinal);
    if (!data || data.length === 0) return;
    const columnas = ["Fecha", "Producto", "Tipo", "Cantidad", "Usuario"];
    const filas = data.map((m) => [m.fecha, m.productos[0].descripcion, m.tipo, m.cantidad.toString(), m.usuarios[0].nombres]);
    generarPDF(`Reporte Movimientos ${fechaInicio} - ${fechaFinal}`, columnas, filas);
  };

  const exportarKardexProductoPDF = async () => {
    if (!idProducto) return;
    const data = await ReporteKardexProducto(Number(empresa?.empresa?.id), Number(idProducto));
    if (!data || data.length === 0) return;
    let saldo = 0;
    const columnas = ["Fecha", "Tipo", "Cantidad", "Saldo", "Detalle", "Usuario"];
    const filas = data.map((k) => {
      saldo += k.tipo === "entrada" ? k.cantidad : -k.cantidad;
      return [k.fecha, k.tipo, k.cantidad.toString(), saldo.toString(), k.detalles ?? "", k.usuarios[0].nombres];
    });
    const producto = dataproductos.find((p: any) => p.id === Number(idProducto));
    generarPDF(`Kardex - ${producto?.descripcion}`, columnas, filas);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Principal */}
        <header className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
            Centro de <span className="text-[#fee685] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Reportes</span>
          </h1>
          <p className="font-bold text-gray-500 uppercase text-sm tracking-widest">Generación de documentos oficiales</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SECCIÓN: INVENTARIO ACTUAL */}
          <section className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#fee685] p-2 border-2 border-black">
                  <Package className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-black uppercase dark:text-white">Inventario Actual</h2>
              </div>
              <p className="text-gray-600 dark:text-zinc-400 font-medium mb-6 ">
                Obtén un resumen detallado de todos los productos y su stock disponible en tiempo real.
              </p>
            </div>
            <button
              onClick={exportarInventarioPDF}
              disabled={inventario.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
            >
              <Download className="w-5 h-5" /> EXPORTAR PDF INVENTARIO
            </button>
          </section>

          {/* SECCIÓN: MOVIMIENTOS POR FECHA */}
          <section className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-400 p-2 border-2 border-black">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase text-black dark:text-white">Movimientos</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Desde</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full border-2 border-black p-2 font-bold dark:bg-zinc-800 dark:text-white outline-none focus:bg-blue-50"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Hasta</label>
                  <input
                    type="date"
                    value={fechaFinal}
                    onChange={(e) => setFechaFinal(e.target.value)}
                    className="w-full border-2 border-black p-2 font-bold dark:bg-zinc-800 dark:text-white outline-none focus:bg-blue-50"
                  />
                </div>
              </div>
              <button
                onClick={exportarMovimientosFecha}
                disabled={!fechaInicio || !fechaFinal}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black py-3 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  active:shadow-none transition-all disabled:opacity-50"
              >
                <FileText className="w-5 h-5" /> DESCARGAR RANGO DE FECHAS
              </button>
            </div>
          </section>

          {/* SECCIÓN: KARDEX POR PRODUCTO */}
          <section className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-400 p-2 border-2 border-black">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase text-black dark:text-white">Kardex Individual por Producto</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 space-y-1 w-full">
                <label className="text-[10px] font-black uppercase text-gray-400">Seleccionar Producto del catálogo</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={idProducto}
                    onChange={(e) => setIdProducto(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-black font-black appearance-none dark:bg-zinc-800 dark:text-white outline-none cursor-pointer focus:bg-green-50"
                  >
                    <option value="">-- ELIGE UN PRODUCTO --</option>
                    {dataproductos.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.descripcion}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={exportarKardexProductoPDF}
                disabled={!idProducto}
                className="w-full md:w-auto px-10 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black border-2 
                border-black py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
              >
                GENERAR KARDEX <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>

        {/* TABLA DE VISTA PREVIA CON PAGINADOR */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-[#fee685] border-b-4 border-black p-4">
            <h3 className="font-black uppercase flex items-center gap-2 text-black">
              <Package className="w-5 h-5" /> Vista Previa de Inventario ({inventario.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center font-black animate-pulse uppercase">Cargando datos del servidor...</div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-800 border-b-4 border-black">
                      <th className="px-6 py-4 text-left font-black uppercase text-sm dark:text-white">Descripción del Producto</th>
                      <th className="px-6 py-4 text-center font-black uppercase text-sm dark:text-white">Stock Disponible</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {currentTableData.map((p) => (
                      <tr key={p.id} className="hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-colors">
                        <td className="px-6 py-4 font-bold dark:text-zinc-300 uppercase">{p.descripcion}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-black text-white px-4 py-1 font-black rounded-full border-2 border-white/20">
                            {p.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* CONTROLES DE PAGINACIÓN */}
                <div className="bg-[#fee685] dark:bg-zinc-800 px-6 py-4 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-xs font-black uppercase dark:text-white">
                    Registros: {inventario.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + rowsPerPage, inventario.length)} de {inventario.length}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-2 border-2 border-black bg-white dark:bg-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 dark:text-white" />
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 border-2 border-black font-black text-sm transition-all ${
                            currentPage === page 
                            ? 'bg-black text-white' 
                            : 'bg-white dark:bg-zinc-700 dark:text-white hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-2 border-2 border-black bg-white dark:bg-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5 dark:text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}