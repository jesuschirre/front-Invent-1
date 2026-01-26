import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CartConfigProps {
  title: string;
  subtitle: string;
  icono: string; 
  link: string;
}

export default function CartConfig({
  title,
  subtitle,
  icono,
  link
}: CartConfigProps) {
  return (
    <Link 
      to={link} 
      className="group relative flex flex-col items-center justify-center p-8 
                 bg-white dark:bg-zinc-900 
                 border-4 border-black 
                 rounded-none 
                 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                 hover:shadow-none 
                 transition-all duration-200 
                 overflow-hidden w-full"
    >
      {/* Contenedor del Icono con borde rígido */}
      <div className="relative mb-6 p-4 bg-[#fee685] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-400 transition-colors duration-300">
        <img 
          src={icono} 
          alt={title} 
          className="h-16 w-16 object-contain transition-transform group-hover:scale-110" 
        />
      </div>

      {/* Textos con jerarquía fuerte */}
      <div className="relative text-center">
        <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter mb-2 group-hover:text-yellow-600 transition-colors">
          {title}
        </h3>
        <div className="h-1 w-12 bg-black dark:bg-white mx-auto mb-3 group-hover:w-full transition-all duration-300" />
        <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 leading-relaxed uppercase tracking-tight">
          {subtitle}
        </p>
      </div>

      {/* Flecha indicadora estética en la esquina inferior */}
      <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-black dark:text-white" />
      </div>
    </Link>
  );
}