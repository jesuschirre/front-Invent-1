import { LinksArray, SecondarylinksArray } from "../../../utils/dataEstatica";
import { NavLink } from "react-router-dom";

interface Props {
  sidebarOpen: boolean;
}

export const Cardlinks = ({ sidebarOpen }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {LinksArray.map((lin) => (
        <NavLink
          key={lin.label}
          to={lin.to}
          end
          className={({ isActive }) => `
            relative flex items-center p-3
            font-black uppercase text-xs tracking-widest transition-all
            border-4 border-black
            ${
              isActive
                ? "bg-[#fe9a00] translate-x-1 translate-y-1 shadow-none text-black"
                : "bg-white hover:bg-[#fee685] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-gray-700"
            }
          `}
        >
          <span className="text-2xl flex-shrink-0">{lin.icon}</span>
          {sidebarOpen && (
            <span className="ml-3 whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
              {lin.label}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export const ConfigLink = ({ sidebarOpen }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {SecondarylinksArray.map((config) => (
        <NavLink
          key={config.label}
          to={config.to}
          className={({ isActive }) => `
            relative flex items-center p-3
            font-black uppercase text-[10px] tracking-tighter transition-all
            border-4 border-black
            ${
              isActive
                ? "bg-black text-[#fee685] translate-x-1 translate-y-1 shadow-none"
                : "bg-zinc-100 hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-gray-600"
            }
          `}
        >
          <span className="text-xl flex-shrink-0">{config.icon}</span>
          {sidebarOpen && (
            <span className="ml-3 whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
              {config.label}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );
};