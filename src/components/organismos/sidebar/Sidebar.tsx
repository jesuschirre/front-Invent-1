import { v } from "../../../styles/variables";
import { RiCloseLine } from "react-icons/ri";
import { Cardlinks, ConfigLink } from "./Cardlinks";
import { UseAuthStore } from "../../../store/authStore";
import { FaRegMoon } from "react-icons/fa";
import { CiBrightnessUp } from "react-icons/ci";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const {signOut} = UseAuthStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`
        fixed z-50 inset-y-0 left-0 w-64 bg-amber-800 text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex
        flex flex-col
      `}
    >
      {/* Header mobile */}
      <div className="flex items-center justify-between mb-8 md:hidden">
        <div className="flex items-center gap-3">
          <img src={v.logo} alt="Logo" className="w-8 h-8" />
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded hover:bg-gray-800"
        >
          <RiCloseLine size={22} />
        </button>
      </div>

      {/* Header desktop */}
      <div className="hidden md:flex gap-3 items-center justify-center min-h-[120px] mb-20">
        <img src={v.logo} alt="Logo" className="w-10 h-10" />
        <span className="text-2xl font-bold">InvenT</span>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-5">
        <Cardlinks />
          <div className=" h-px bg-gray-700 my-2"></div>
        <ConfigLink/>

        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
          <button
              onClick={toggleTheme}
              className="
                w-11 h-11
                rounded-full
                flex items-center justify-center
                bg-white dark:bg-gray-800
                text-gray-600 dark:text-yellow-400
                shadow-md
                hover:scale-105
                transition-all
              "
            >
              {theme === "light" ? <FaRegMoon /> : <CiBrightnessUp />}
            </button>
          </div>
        </div>
        <button onClick={signOut} className="bg-black text-white">
          cerrar sesion
        </button>
      </nav>
      
        
    </aside>
  );
};

export default Sidebar;