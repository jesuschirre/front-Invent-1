import CartConfig from "../moleculas/CartConfig";
import { DataModulosConfiguracion } from "../../utils/dataEstatica";

export default function ConfiguracionTemplate() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-screen p-10 gap-5">
       {DataModulosConfiguracion.map((ConfiAray)=>(
            <CartConfig
                key={ConfiAray.title}
                title={ConfiAray.title}
                subtitle={ConfiAray.subtitle}
                icono={ConfiAray.icono}
                link={ConfiAray.link}
            />
       ))} 
    </div>

  );
}
