import { Link } from "react-router-dom";

interface CartConfigProps {
  title: string;
  subtitle: string;
  icono: string; // Puede ser una URL o un componente de Lucide
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
      className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 dark:border-gray-700
                shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden w-full dark:bg-black"
    >
      {/* Decoración de fondo al hacer hover */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-amber-100 rounded-full transition-transform group-hover:scale-[2.5] duration-700 opacity-20" />

      {/* Contenedor del Icono */}
      <div className="relative mb-4 p-4 bg-amber-50 rounded-xl group-hover:bg-amber-400 transition-colors duration-300">
        <img 
          src={icono} 
          alt={title} 
          className="h-25 w-25 object-contain filter group-hover:brightness-110 transition-all" 
        />
      </div>

      {/* Textos */}
      <div className="relative text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-amber-600 transition-colors dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Indicador visual inferior */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-amber-400 group-hover:w-full transition-all duration-500" />
    </Link>
  );
}