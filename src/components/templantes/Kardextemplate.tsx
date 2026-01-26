import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpCircle, ArrowDownCircle, Plus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { MostrarKardex } from '../../supabase/crudKardex';
import { UserAuth } from '../../context/AuthContext';
import ModalInsertKardex from '../organismos/form/ModalInsertKardex';

interface KardexProducto {
  descripcion: string;
}

interface KardexUsuario {
  nombres: string;
}

interface KardexItem {
  id: number;
  fecha: string;
  tipo: string;
  id_producto: KardexProducto;
  cantidad: number;
  id_usuario: KardexUsuario;
  detalles: string;
}

export default function KardexTemplate() {
  const { empresa } = UserAuth();
  const [kardexData, setKardexData] = useState<KardexItem[]>([]);
  const [OpenInKardModal, setOpenInKardModal] = useState(false);
  
  // ESTADOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [filters, setFilters] = useState({
    producto: '',
    tipoMovimiento: '',
    fechaInicio: '',
    fechaFin: '',
    codigo: ''
  });
  const [filteredData, setFilteredData] = useState<KardexItem[]>([]);

  useEffect(() => {
    const cargarKardex = async () => {
      if (!empresa?.empresa?.id) return;
      const res = await MostrarKardex(empresa.empresa.id);
      if (res) setKardexData(res);
    };
    cargarKardex();
  }, [empresa?.empresa?.id]);

  useEffect(() => {
    applyFilters();
  }, [filters, kardexData]);

  // Lógica de cálculo de paginación
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTableData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Efecto para resetear página al filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...kardexData];
    if (filters.producto) {
      filtered = filtered.filter(item =>
        item.id_producto?.descripcion?.toLowerCase().includes(filters.producto.toLowerCase())
      );
    }
    if (filters.tipoMovimiento) {
      filtered = filtered.filter(item => item.tipo === filters.tipoMovimiento);
    }
    if (filters.fechaInicio) {
      filtered = filtered.filter(item => new Date(item.fecha) >= new Date(filters.fechaInicio));
    }
    if (filters.fechaFin) {
      const endDate = new Date(filters.fechaFin);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(item => new Date(item.fecha) <= endDate);
    }
    setFilteredData(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const summary = {
    totalEntradas: filteredData.filter(item => item.tipo === 'entrada').reduce((sum, item) => sum + (item.cantidad || 0), 0),
    totalSalidas: filteredData.filter(item => item.tipo === 'salida').reduce((sum, item) => sum + (item.cantidad || 0), 0),
  };

  const getMovimientoBadge = (tipo: string) => {
    const styles = {
      entrada: 'bg-green-100 text-green-800 border-green-600',
      salida: 'bg-red-100 text-red-800 border-red-600',
      ajuste: 'bg-yellow-100 text-yellow-800 border-yellow-600'
    };
    return styles[tipo as keyof typeof styles] || 'bg-gray-100 border-gray-600';
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              KARDEX
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Control de flujo de inventario</p>
          </div>
          <button 
            onClick={() => setOpenInKardModal(true)}
            className="flex items-center justify-center gap-2 bg-[#fee685] hover:bg-yellow-400 text-black border-4 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Plus className="w-5 h-5" /> Nuevo Movimiento
          </button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl border-2 border-green-600">
              <ArrowUpCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Entradas</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalEntradas}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl border-2 border-red-600">
              <ArrowDownCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Salidas</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalSalidas}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl border-2 border-blue-600">
              <RotateCcw className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Neto</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalEntradas - summary.totalSalidas}</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black overflow-hidden mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-[#fee685] border-b-2 border-black px-6 py-3 flex items-center justify-between">
            <span className="flex items-center gap-2 font-black uppercase text-sm">
              <Filter className="w-4 h-4" /> Filtros de Búsqueda
            </span>
            <button 
              onClick={() => setFilters({ producto: '', tipoMovimiento: '', fechaInicio: '', fechaFin: '', codigo: '' })}
              className="text-xs font-bold underline hover:text-red-600"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase dark:text-white">Producto</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl dark:bg-zinc-800 dark:text-white focus:ring-2 ring-yellow-400 outline-none transition-all"
                  placeholder="Buscar..."
                  value={filters.producto}
                  onChange={(e) => handleFilterChange('producto', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase dark:text-white">Tipo</label>
              <select 
                className="w-full px-4 py-2 border-2 border-black rounded-xl dark:bg-zinc-800 dark:text-white outline-none"
                value={filters.tipoMovimiento}
                onChange={(e) => handleFilterChange('tipoMovimiento', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="entrada">Entradas</option>
                <option value="salida">Salidas</option>
                <option value="ajuste">Ajustes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase dark:text-white">Desde</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border-2 border-black rounded-xl dark:bg-zinc-800 dark:text-white outline-none"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase dark:text-white">Hasta</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border-2 border-black rounded-xl dark:bg-zinc-800 dark:text-white outline-none"
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-800 border-b-2 border-black">
                  <th className="px-6 py-4 text-left text-xs font-black uppercase dark:text-white">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase dark:text-white">Producto</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase dark:text-white">Movimiento</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase dark:text-white">Cant.</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase dark:text-white">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase dark:text-white">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 dark:divide-zinc-800">
                {currentTableData.map((item) => (
                  <tr key={item.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium dark:text-zinc-300">
                      {new Date(item.fecha).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold dark:text-white">
                      {item.id_producto?.descripcion}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border-2 ${getMovimientoBadge(item.tipo)}`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center font-black ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.tipo === 'entrada' ? '+' : '-'}{item.cantidad}
                    </td>
                    <td className="px-6 py-4 text-sm dark:text-zinc-400">
                      {item.id_usuario?.nombres}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic truncate max-w-[200px]">
                      {item.detalles || '---'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-block p-6 rounded-full bg-slate-100 dark:bg-zinc-800 mb-4 border-2 border-dashed border-black">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-500 font-bold">No se encontraron registros</p>
            </div>
          )}

          {/* CONTROLES DE PAGINACIÓN */}
          <div className="bg-[#fee685] dark:bg-zinc-800 px-6 py-4 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-black uppercase text-black dark:text-white">
              Mostrando {filteredData.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + rowsPerPage, filteredData.length)} de {filteredData.length} registros
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 border-2 border-black font-black text-sm transition-all ${
                      currentPage === page 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
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
        </div>
      </div>

      {OpenInKardModal && (
        <ModalInsertKardex onClose={() => setOpenInKardModal(false)} />
      )}
    </div>
  );
}