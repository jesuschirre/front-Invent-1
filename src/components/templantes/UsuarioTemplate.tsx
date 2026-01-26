import { useEffect, useState } from "react";
import CirImg from "../moleculas/CirImg";
import { UserAuth } from "../../context/AuthContext";
import { GrAdd, GrSearch } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { useUsuarioStore } from "../../store/UsuariosStore";
import { type InterfaceUsuarios } from "../../store/UsuariosStore";
import ModalInsertUsuario from "../organismos/form/ModalInsertUsuario";
import EditarUsuarioModal from "../organismos/form/EditarUsuarioModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UsuarioTemplate() {
  const { empresa } = UserAuth();
  const { Usuariosdeempresa, datausuarios, eliminarusuario } = useUsuarioStore();
  
  const [openModalUsu, setOpenModalUsu] = useState(false);
  const [openModalEditUsu, setOpenModalEditUsu] = useState(false);
  const [usuSeleccionada, setUsuSeleccionada] = useState<InterfaceUsuarios | null>(null);

  // Estados para Buscador y Paginación
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  useEffect(() => {
    if (!empresa?.empresa?.id) return;
    Usuariosdeempresa(empresa.empresa.id);
  }, [Usuariosdeempresa, empresa]);

  // Lógica de Filtrado (Busca por nombre o correo)
  const usuariosFiltrados = datausuarios.filter((u) =>
    u.nombres.toLowerCase().includes(filtro.toLowerCase()) ||
    u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  // Lógica de Paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const currentTableData = usuariosFiltrados.slice(startIndex, startIndex + itemsPorPagina);

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CirImg />
          <div className="px-4 py-1 bg-black text-white font-black text-xs uppercase tracking-widest">
            INVENTARIO
          </div>
        </header>

        {/* HEADER DE PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">
              Usuarios
            </h1>
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-[0.2em]">
              Acceso y Roles de Empresa / {usuariosFiltrados.length} Total
            </p>
          </div>
          
          <button
            onClick={() => setOpenModalUsu(true)}
            className="flex items-center justify-center gap-2 bg-[#fee685] hover:bg-yellow-400 text-black px-8 py-4 border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none"
          >
            <GrAdd size={20} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 p-2">
           <div className="bg-black text-white p-3 border-2 border-black">
              <GrSearch size={20} />
           </div>
           <input 
              type="text"
              placeholder="BUSCAR USUARIO POR NOMBRE O CORREO..."
              className="w-full bg-transparent outline-none font-black uppercase text-sm dark:text-white placeholder:text-gray-400"
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
           />
        </div>

        {/* TABLA NATIVA */}
        <section className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fee685] border-b-4 border-black text-black">
                  <th className="p-4 font-black uppercase text-xs border-r-2 border-black">Nombre / Correo</th>
                  <th className="p-4 font-black uppercase text-xs border-r-2 border-black">Documento / Nro cel</th>
                  <th className="p-4 font-black uppercase text-xs border-r-2 border-black text-center">Rol</th>
                  <th className="p-4 font-black uppercase text-xs border-r-2 border-black text-center">Estado</th>
                  <th className="p-4 font-black uppercase text-xs text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {currentTableData.length > 0 ? (
                  currentTableData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <td className="p-4 border-r-2 border-black">
                        <div className="font-black uppercase dark:text-white">{item.nombres}</div>
                        <div className="text-[10px] font-bold text-gray-400">{item.correo}</div>
                      </td>
                      <td className="p-4 border-r-2 border-black">
                        <div className="text-xs font-black dark:text-gray-300">{item.tipodoc}: {item.nro_doc}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{item.telefono}</div>
                      </td>
                      <td className="p-4 border-r-2 border-black text-center">
                        <span className="px-2 py-1 border-2 border-black bg-blue-100 text-blue-800 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {item.tipouser}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-black text-center">
                        <span className={`px-2 py-1 border-2 border-black text-[10px] font-black uppercase ${item.estado === "activo" ? 'bg-green-400' : 'bg-red-400'}`}>
                          {item.estado === "activo" ? 'activo' : 'inactivo'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setUsuSeleccionada(item);
                              setOpenModalEditUsu(true);
                            }}
                            className="p-2 border-2 border-black bg-white hover:bg-blue-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                          >
                            <GoPencil size={18} />
                          </button>
                          <button
                            onClick={() => eliminarusuario(item.id)}
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
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINADOR */}
          <div className="bg-[#fee685] dark:bg-zinc-800 px-6 py-4 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-black uppercase text-black dark:text-white">
              Mostrando {usuariosFiltrados.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPorPagina, usuariosFiltrados.length)} de {usuariosFiltrados.length} registros
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

        {openModalUsu && <ModalInsertUsuario onClose={() => setOpenModalUsu(false)} />}
        {openModalEditUsu && usuSeleccionada && (
          <EditarUsuarioModal
            usuario={usuSeleccionada}
            onClose={() => {
              setOpenModalEditUsu(false);
              setUsuSeleccionada(null);
            }}
          />
        )}
      </div>
    </div>
  );
}