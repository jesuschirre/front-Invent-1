import { useEffect, useState } from "react";
import axios from "axios";
import { UserAuth } from "../../../context/AuthContext";
import { useProductosStore } from "../../../store/ProductosStore";
import { GrClose, GrSearch, GrRobot, GrLineChart, GrAlert, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
}

export default function ModalIA({ onClose }: Props) {
  const { empresa } = UserAuth();
  const { mostrarproductos, dataproductos } = useProductosStore();

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  useEffect(() => {
    if (!empresa?.empresa?.id) return;
    mostrarproductos(empresa.empresa.id);
  }, [mostrarproductos, empresa]);

  const filteredProducts = dataproductos.filter((p) =>
    p.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const ejecutarAnalisis = async (tipo: 'rotation' | 'stock-risk') => {
    if (!selectedProductId) {
      Swal.fire({
        icon: "warning",
        title: "SIN SELECCIÓN",
        text: "Primero elige un producto de la lista",
        confirmButtonColor: "#000"
      });
      return;
    }

    try {
      setLoading(true);
      setResultado(null);
      const endpoint = tipo === 'rotation' ? 'rotation' : 'stock-risk';
      const response = await axios.post(`http://localhost:8000/api/ai/kardex/product/${endpoint}`, {
        product_id: selectedProductId
      });

      // Asumiendo que la respuesta viene en un campo 'analysis' o similar
      setResultado(response.data.analysis || JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "ERROR IA", text: "No se pudo procesar el análisis" });
    } finally {
      setLoading(false);
    }
  };

  const btnActionStyles = "flex-1 flex items-center justify-center gap-2 p-3 font-black uppercase text-xs border-4 border-black transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-cyan-400 border-b-4 border-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 border-2 border-black">
              <GrRobot size={24} />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-black">
              AI Predictor Core<span className="not-italic">_</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-1 border-2 border-black bg-white hover:bg-red-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
            <GrClose size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* BUSCADOR */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block">Seleccionar Objetivo</label>
            <div className="relative">
              <GrSearch className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="FILTRAR PRODUCTOS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-4 border-black p-3 pl-12 font-black uppercase text-sm focus:bg-cyan-50 outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
              />
            </div>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div className="border-4 border-black h-48 overflow-y-auto bg-gray-50 dark:bg-zinc-800 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`p-3 border-b-2 border-black cursor-pointer font-bold uppercase text-xs transition-colors flex justify-between items-center
                  ${selectedProductId === p.id ? "bg-black text-white" : "hover:bg-cyan-100 dark:hover:bg-zinc-700"}`}
              >
                <span>{p.descripcion}</span>
                {selectedProductId === p.id && <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>}
              </div>
            ))}
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => ejecutarAnalisis('rotation')}
              disabled={loading}
              className={`${btnActionStyles} bg-purple-400 hover:bg-purple-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              <GrLineChart /> Análisis Rotación
            </button>

            <button
              onClick={() => ejecutarAnalisis('stock-risk')}
              disabled={loading}
              className={`${btnActionStyles} bg-amber-400 hover:bg-amber-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              <GrAlert /> Riesgo de Stock
            </button>
          </div>

          {/* ÁREA DE RESULTADOS */}
          {(loading || resultado) && (
            <div className="border-4 border-black p-4 bg-black text-cyan-400 font-mono text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-cyan-400 text-black text-[8px] font-black">AI_OUTPUT</div>
              {loading ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <GrRotateLeft className="animate-spin" />
                  <span>PROCESANDO DATOS EN RED NEURONAL...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  <span className="text-white inline-block mb-2 font-black uppercase tracking-widest">{">"} RESULTADO DEL ANÁLISIS:</span><br/>
                  {resultado}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-100 dark:bg-zinc-800 border-t-4 border-black flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-4 border-black font-black uppercase text-xs bg-white hover:bg-gray-200 transition-all"
          >
            Cerrar Terminal
          </button>
        </div>
      </div>
    </div>
  );
}