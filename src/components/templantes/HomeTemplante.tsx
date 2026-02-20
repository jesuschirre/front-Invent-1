import CirImg from "../moleculas/CirImg";
import { FaRegBuilding } from "react-icons/fa";
import { useUsuarioStore } from "../../store/UsuariosStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import { useEffect } from "react";
import { Sparkles, Users, Coins } from "lucide-react";
export default function HomeTemplate() {
  const { mostrarUsuarios } = useUsuarioStore();
  const {
    mostrarEmpresa,
    contarusuariosXempresa,
    dataempresa,
    contadorusuarios
  } = useEmpresaStore();

  useEffect(() => {
    const cargarDatos = async () => {
      const usuario = await mostrarUsuarios();
      if (!usuario?.id) return;

      const empresaAsignada = await mostrarEmpresa(usuario.id);

      if (empresaAsignada?.empresa?.id) {
        await contarusuariosXempresa(empresaAsignada.empresa.id);
      }
    };

    cargarDatos();
  }, [mostrarUsuarios, mostrarEmpresa, contarusuariosXempresa]);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col h-full gap-8">
        
        {/* Header / Perfil */}
        <header className="flex items-center justify-between">
          <div className="p-1 border-4 border-black rounded-full bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CirImg />
          </div>
        </header>

        {/* Sección de Bienvenida */}
        <section className="relative">
          <h1 className="text-5xl md:text-7xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Tu <span className="text-[#fee685] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Empresa</span>
          </h1>
          <div className="h-2 w-24 bg-black dark:bg-white mt-2"></div>
        </section>

        {/* Contenido Principal / Card Central */}
        <main className="flex-1">
          <div className="flex flex-col items-center justify-center h-full gap-10">
            
            {/* Card de Identidad de Empresa */}
            <div className="w-full bg-[#fee685] border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              {/* Decoración de fondo */}
              <Sparkles className="absolute w-24 h-24 text-yellow-600 opacity-20 group-hover:rotate-12 transition-transform" />
              
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="bg-white p-4 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FaRegBuilding className="h-12 w-12 text-black" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
                    {dataempresa?.empresa?.nombre ?? "Cargando..."}
                  </h2>
                  <p className="text-lg font-bold text-black/70 italic">
                    "InvenT te mantiene siempre informado"
                  </p>
                </div>
              </div>
            </div>

            {/* Grid de Métricas (Cart) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              
              {/* Contenedor personalizado para los Cart para forzar el estilo si el componente es rígido */}
              <div className="group transition-transform hover:-translate-y-1">
                <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5">
                   <div className="bg-blue-400 p-3 border-2 border-black">
                      <Coins className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                     <p className="text-xs font-black uppercase text-gray-500">Moneda Local</p>
                     <p className="text-2xl font-black dark:text-white">{dataempresa?.empresa?.simbolomone ?? "-"}</p>
                   </div>
                </div>
              </div>

              <div className="group transition-transform hover:-translate-y-1">
                <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5">
                   <div className="bg-green-400 p-3 border-2 border-black">
                      <Users className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                     <p className="text-xs font-black uppercase text-gray-500">Usuarios Activos</p>
                     <p className="text-2xl font-black dark:text-white">{contadorusuarios}</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </main>


      </div>
    </div>
  );
}