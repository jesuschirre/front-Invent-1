export default function PaginaRecarga() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Contenedor de la animación */}
      <div className="loop cubes scale-150 md:scale-[2]">
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
      </div>

      {/* Texto opcional para reforzar el bloqueo */}
      <div className="absolute bottom-10 animate-pulse font-black uppercase tracking-widest text-black dark:text-white">
        Cargando Inventario
      </div>
    </div>
  );
}