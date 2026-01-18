import CirImg from "../moleculas/CirImg";
import Cart from "../moleculas/Cart";
import { FaRegBuilding } from "react-icons/fa";
import { useUsuarioStore } from "../../store/UsuariosStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import { useEffect } from "react";

export default function HomeTemplante() {
    const { mostrarUsuarios } = useUsuarioStore();
    const {
      mostrarEmpresa,
      contarusuariosXempresa,
      dataempresa,
      contadorusuarios
    } = useEmpresaStore();

    useEffect(() => {
      const cargarDatos = async () => {
        const usuario = await mostrarUsuarios();

        if (!usuario?.id) return;

        // obtener empresa
        const empresaAsignada = await mostrarEmpresa(usuario.id);

        // validar y contar usuarios
        if (empresaAsignada?.empresa?.id) {
          await contarusuariosXempresa(empresaAsignada.empresa.id);
        }
      };

      cargarDatos();
    }, [mostrarUsuarios, mostrarEmpresa, contarusuariosXempresa]);


  return (
    <div className="h-screen p-4 md:p-8 lg:p-10 box-border">
      <div className="flex flex-col h-full">

        <header className="h-24 flex items-center">
          <CirImg />
        </header>

        <section className="h-24 flex items-center">
          <h1 className="text-2xl font-black dark:text-white">
            Tu empresa
          </h1>
        </section>

        <section className="flex-1 overflow-y-auto rounded-xl">
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4">

            <div className="flex items-center gap-2">
              <FaRegBuilding className="h-7 w-7 dark:text-white" />
              <h1 className="text-2xl font-black dark:text-white">
                {dataempresa?.empresa?.nombre ?? "Cargando..."}
              </h1>
            </div>

            <p className="text-gray-600 dark:text-white">
              InvenT te mantiene siempre informado.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Cart
                title="Moneda"
                description={dataempresa?.empresa?.simbolomone ?? "-"}
              />
              <Cart
                title="Usuarios"
                description={contadorusuarios}
              />
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}