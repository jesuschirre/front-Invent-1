import { LinksArray } from "../../../utils/dataEstatica";
import { NavLink } from "react-router-dom";
import { SecondarylinksArray } from "../../../utils/dataEstatica";
import { v, Btnsave } from "../../../index";

export const Cardlinks = () => {
  return (
    <div  >
        {LinksArray.map((lin) => (
        <NavLink
            key={lin.label}
            to={lin.to}
            end
            className={({ isActive }) =>
            `
            relative flex items-center gap-4 w-full
            min-h-[50px] text-lg transition-all duration-200
            ${
                isActive
                ? "text-orange-400 bg-gray-950 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-400"
                : "text-white hover:bg-gray-800"
            }
            `
            }
        >
                <span className="text-3xl ml-2">{lin.icon}</span>
                <span>{lin.label}</span>
        </NavLink>
        ))}

    </div>
  );
};

export const ConfigLink = () => {
  return (
    <div>
      {SecondarylinksArray.map((config) => (
        <NavLink
          key={config.label}
          to={config.to}
          className={({ isActive }) =>
            ` relative flex items-center gap-4 w-full
            min-h-[50px] text-lg transition-all duration-200
             ${
               isActive
                ? "text-orange-400 bg-gray-950   before:bg-orange-400"
                : "text-white hover:bg-gray-800"
             }`
          }
        >
          <span className="text-3xl ml-2">{config.icon}</span>
          <span>{config.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export function SidebarCard() {
  return (
    <div className="relative w-full p-4 text-center">
      {/* Icono flotante */}
      <span className="
        absolute text-5xl rounded-full
        -top-2 left-1/2 -translate-x-1/2
        z-20
      ">
        <v.iconoayuda />
      </span>

      {/* Card */}
      <div className="
        relative p-4 rounded-xl overflow-hidden
        bg-gray-100
      ">
        {/* Círculos decorativos */}
        <div className="
          absolute w-[100px] h-[100px]
          bg-white rounded-full opacity-70
          -top-12 -left-12
        " />

        <div className="
          absolute w-[130px] h-[130px]
          bg-white rounded-full opacity-70
          -bottom-20 -right-16
        " />

        {/* Contenido */}
        <h3 className="
          text-lg font-extrabold text-black
          mt-4 py-4
        ">
          Cerrar sesión
        </h3>

        {/* Botón */}
        <div className="relative -ml-2">
          <Btnsave titulo="Cerrar ..." bgcolor="#f8f2fd" />
        </div>
      </div>
    </div>
  );
}
