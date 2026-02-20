import { useState, useEffect, useCallback, useMemo } from 'react';
import { Filter, ArrowUpCircle, ArrowDownCircle, Plus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { MostrarKardex } from '../../supabase/crudKardex';
import { UserAuth } from '../../context/AuthContext';
import ModalInsertKardex from '../organismos/form/ModalInsertKardex';
import ModalIA from '../organismos/form/ModalIA';
import { GiFairyWand } from "react-icons/gi";

// --- INTERFACES ---
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

interface Filters {
  producto: string;
  tipoMovimiento: string;
  fechaInicio: string;
  fechaFin: string;
}

interface Summary {
  entradas: number;
  salidas: number;
  neto: number;
}

export default function KardexTemplate() {
  const { empresa } = UserAuth();
  const [kardexData, setKardexData] = useState<KardexItem[]>([]);
  const [OpenInKardModal, setOpenInKardModal] = useState<boolean>(false);
  const [OpenIAdModal, setOpenIAdModal] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const [filters, setFilters] = useState<Filters>({
    producto: '',
    tipoMovimiento: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const cargarKardex = useCallback(async () => {
    if (!empresa?.empresa?.id) return;
    const res = await MostrarKardex(empresa.empresa.id);
    if (res) setKardexData(res as KardexItem[]);
  }, [empresa?.empresa?.id]);

  useEffect(() => {
    cargarKardex();
  }, [cargarKardex]);

  const filteredData = useMemo(() => {
    return kardexData.filter(item => {
      const matchProducto = item.id_producto?.descripcion?.toLowerCase().includes(filters.producto.toLowerCase());
      const matchTipo = filters.tipoMovimiento ? item.tipo === filters.tipoMovimiento : true;
      const fechaItem = new Date(item.fecha);
      const matchInicio = filters.fechaInicio ? fechaItem >= new Date(filters.fechaInicio) : true;
      const matchFin = filters.fechaFin ? fechaItem <= new Date(filters.fechaFin + "T23:59:59") : true;
      return matchProducto && matchTipo && matchInicio && matchFin;
    });
  }, [filters, kardexData]);

  const summary = useMemo<Summary>(() => {
    const entradas = filteredData.filter(i => i.tipo === 'entrada').reduce((s, i) => s + (i.cantidad || 0), 0);
    const salidas = filteredData.filter(i => i.tipo === 'salida').reduce((s, i) => s + (i.cantidad || 0), 0);
    return { entradas, salidas, neto: entradas - salidas };
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  useEffect(() => setCurrentPage(1), [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Kardex</h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">Control de Inventario Atómico</p>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <button onClick={() => setOpenIAdModal(true)} className="flex items-center justify-center gap-2 bg-[#fee685] hover:bg-yellow-400 text-black border-4 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
              <GiFairyWand className="w-5 h-5" /> Consultar IA
            </button>
            <button onClick={() => setOpenInKardModal(true)} className="flex items-center justify-center gap-2 bg-[#fee685] hover:bg-yellow-400 text-black border-4 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
              <Plus className="w-5 h-5" /> Nuevo Registro
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Entradas" value={summary.entradas} icon={<ArrowUpCircle className="text-green-600"/>} color="green" />
          <StatCard title="Salidas" value={summary.salidas} icon={<ArrowDownCircle className="text-red-600"/>} color="red" />
          <StatCard title="Balance Neto" value={summary.neto} icon={<RotateCcw className="text-blue-600"/>} color="blue" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="bg-[#fee685] border-b-4 border-black px-6 py-2 flex justify-between items-center">
            <span className="font-black text-sm uppercase flex items-center gap-2"><Filter size={16}/> Panel de Filtros</span>
            <button onClick={() => setFilters({producto:'', tipoMovimiento:'', fechaInicio:'', fechaFin:''})} className="text-xs font-bold underline">Limpiar</button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterInput label="Producto" value={filters.producto} onChange={(v: string) => handleFilterChange('producto', v)} placeholder="Nombre..." />
            <FilterSelect label="Tipo" value={filters.tipoMovimiento} onChange={(v: string) => handleFilterChange('tipoMovimiento', v)} />
            <FilterDate label="Desde" value={filters.fechaInicio} onChange={(v: string) => handleFilterChange('fechaInicio', v)} />
            <FilterDate label="Hasta" value={filters.fechaFin} onChange={(v: string) => handleFilterChange('fechaFin', v)} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full ">
              <thead >
                <tr className="bg-[#fee685] border-b-4 border-black font-black uppercase text-xs">
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Producto</th>
                  <th className="px-6 py-4 text-left">Tipo</th>
                  <th className="px-6 py-4 text-center">Cant.</th>
                  <th className="px-6 py-4 text-left">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {currentTableData.map((item) => (
                  <tr key={item.id} className="hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold dark:text-white">{new Date(item.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-black dark:text-white">{item.id_producto?.descripcion}</td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 text-[10px] font-black border-2 border-black rounded-full uppercase ${item.tipo === 'entrada' ? 'bg-green-400' : 'bg-red-400'}`}>
                         {item.tipo}
                       </span>
                    </td>
                    <td className={`px-6 py-4 text-center font-black ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.tipo === 'entrada' ? '+' : '-'}{item.cantidad}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium dark:text-white">{item.id_usuario?.nombres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalResults={filteredData.length} rowsPerPage={rowsPerPage} />
        </div>
      </div>
      {OpenInKardModal && <ModalInsertKardex onClose={() => setOpenInKardModal(false)} onSuccess={cargarKardex} />}
      {OpenIAdModal && <ModalIA onClose={() => setOpenIAdModal(false)} />}
    </div>
  );
}

// --- SUB-COMPONENTES CON TIPADO ---
interface StatCardProps { title: string; value: number; icon: React.ReactNode; color: string; }
const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
    <div className={`p-3 rounded-xl border-2 border-black bg-${color}-100`}>{icon}</div>
    <div>
      <p className="text-xs font-black uppercase text-slate-500">{title}</p>
      <p className="text-3xl font-black dark:text-white">{value}</p>
    </div>
  </div>
);

interface FilterInputProps { label: string; value: string; onChange: (v: string) => void; placeholder?: string; }
const FilterInput = ({ label, value, onChange, placeholder }: FilterInputProps) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase dark:text-white">{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2 border-2 border-black rounded-lg dark:bg-zinc-800 outline-none focus:bg-yellow-50 dark:text-white" />
  </div>
);

interface FilterSelectProps { label: string; value: string; onChange: (v: string) => void; }
const FilterSelect = ({ value, onChange }: FilterSelectProps) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase dark:text-white">Tipo</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 border-2 border-black rounded-lg dark:bg-zinc-800 outline-none dark:text-white">
      <option value="">Todos</option>
      <option value="entrada">Entradas</option>
      <option value="salida">Salidas</option>
    </select>
  </div>
);

const FilterDate = ({ label, value, onChange }: FilterInputProps) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase dark:text-white">{label}</label>
    <input type="date" value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 border-2 border-black rounded-lg dark:bg-zinc-800 outline-none dark:text-white" />
  </div>
);

interface PaginationProps { currentPage: number; totalPages: number; onPageChange: (p: number) => void; totalResults: number; rowsPerPage: number; }
const Pagination = ({ currentPage, totalPages, onPageChange, totalResults, rowsPerPage }: PaginationProps) => {
  const startIdx = (currentPage - 1) * rowsPerPage + 1;
  return (
    <div className="bg-[#fee685] dark:bg-zinc-800 px-6 py-4 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[10px] font-black uppercase text-black dark:text-white">Mostrando {totalResults > 0 ? startIdx : 0} - {Math.min(startIdx + rowsPerPage - 1, totalResults)} de {totalResults}</p>
      <div className="flex gap-2">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="p-2 border-2 border-black bg-white disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><ChevronLeft size={16}/></button>
        <span className="flex items-center px-4 font-black text-sm border-2 border-black bg-black text-white">{currentPage} / {totalPages || 1}</span>
        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => onPageChange(currentPage + 1)} className="p-2 border-2 border-black bg-white disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><ChevronRight size={16}/></button>
      </div>
    </div>
  );
};