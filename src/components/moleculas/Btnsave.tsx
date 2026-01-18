import { Icono } from "../../index";

interface BtnsaveProps {
  funcion?: () => void;
  titulo: string;
  bgcolor?: string;
  icono?: React.ReactNode;
  url?: string;
}

export function Btnsave({
  funcion,
  titulo,
  bgcolor = "#f8f2fd",
  icono,
  url,
}: BtnsaveProps) {
  return (
    <button
      type="submit"
      onClick={funcion}
      className="flex items-center justify-center gap-2 z-20 bg-transparent border-none"
    >
      {icono && <Icono>{icono}</Icono>}

      <span
        className="
          px-5 py-2
          text-lg font-black text-black
          border-4 border-black rounded-md
          shadow-[2px_2px_0px_#000]
          transition-all duration-200
          hover:-translate-x-[1px] hover:-translate-y-[1px]
          hover:shadow-[3px_3px_0px_#000]
          active:translate-x-[1px] active:translate-y-[1px]
          active:shadow-[1px_1px_0px_#000]
          cursor-pointer
        "
        style={{ backgroundColor: bgcolor }}
      >
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-black"
          >
            {titulo}
          </a>
        ) : (
          titulo
        )}
      </span>
    </button>
  );
}