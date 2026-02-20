import { Cardlinks, ConfigLink } from "./Cardlinks";
import { UseAuthStore } from "../../../store/authStore";
import { FaRegMoon } from "react-icons/fa";
import { CiBrightnessUp } from "react-icons/ci";
import { useTheme } from "../../../context/ThemeContext";
import { ChevronLast, ChevronFirst, LogOut, Menu, X } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { signOut } = UseAuthStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* BOTÓN FLOTANTE MÓVIL (Solo visible cuando el sidebar está cerrado en pantallas pequeñas) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-[#fdc700] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          <Menu size={24} />
        </button>
      )}

      {/* OVERLAY PARA MÓVIL (Oscurece el fondo al abrir el menú) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside 
        className={`
          fixed md:relative z-[100] md:z-auto h-screen transition-all duration-300 ease-in-out border-r-4 border-black
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"}
        `}
      >
        <nav className="h-full flex flex-col bg-[#fdc700] dark:bg-zinc-900 overflow-hidden">
          
          {/* LOGO Y TOGGLE */}
          <div className="p-4 mb-8 flex justify-between items-center border-b-4 border-black bg-white dark:bg-zinc-800"> 
              <div className="flex items-center gap-2">
                  
                  {(sidebarOpen) && 
                   <div className="flex gap-2">
                    <span className="text-xl font-black italic tracking-tighter dark:text-white">INVENTARIO</span>
                  </div>}
              </div>
              
              {/* Toggle: En móvil es una X para cerrar, en desktop es el chevron */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 border-2 border-black bg-[#fee685] hover:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <span className="md:hidden"><X size={20} /></span>
                <span className="hidden md:block">
                  {sidebarOpen ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
                </span>
              </button>
          </div>

          {/* ENLACES PRINCIPALES */}
          <div className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
              <Cardlinks sidebarOpen={sidebarOpen} />
              <div className="h-1 bg-black my-4 mx-2"></div>
              <ConfigLink sidebarOpen={sidebarOpen} />
          </div>
            
          {/* FOOTER */}
          <div className="p-4 border-t-4 border-black bg-white dark:bg-zinc-800 space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full h-12 border-4 border-black flex items-center justify-center bg-[#fee685] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {theme === "light" ? <FaRegMoon size={20} /> : <CiBrightnessUp size={24} className="text-orange-600" />}
              {sidebarOpen && <span className="ml-2 font-black uppercase text-[10px] text-black">Modo {theme === "light" ? "Noche" : "Día"}</span>}
            </button>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 p-3 border-4 border-black bg-red-400 text-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <LogOut size={18} />
              {sidebarOpen && <span>Cerrar sesión</span>}
            </button>
          </div>
          
        </nav>    
      </aside>
    </>
  );
};

export default Sidebar;