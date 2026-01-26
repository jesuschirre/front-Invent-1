import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../../store/UsuariosStore";
import { useMutation } from "@tanstack/react-query";
import carrito from "../../assets/carrito.svg";
import logo from "../../assets/inventarioslogo.png";
import { TbLockPassword } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import { UseAuthStore } from "../../store/authStore";

export default function LoginTemplante() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { signInWithEmail } = UseAuthStore();


  const InsertUsuAdmin = useUsuarioStore(
    (state) => state.InsertUsuAdmin
  );
  async function iniciar(email:string, Pass:string) {
    try {
      const response = await signInWithEmail({correo: email, pass: Pass,});
      if (response) navigate("/");
    } catch (error) {
      
    }
  }

  const mutation = useMutation({
    mutationKey: ["insert-usuario-admin"],
    mutationFn: async () => {
      return await InsertUsuAdmin({
        email: "qopa4@airsworld.net",
        pass: "123456",
      });
    },
    onSuccess: (data) => {
      if (data) navigate("/");
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">

      {/* --- LADO IZQUIERDO (Branding y Visual) --- */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white flex-col justify-between p-12">
        {/* Patrón de fondo sutil (opcional, da textura) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        {/* Header del lado izquierdo */}
        <div className="flex items-center gap-3 z-10">
            <img src={logo} alt="Logo InvenT" className="w-10 h-10 drop-shadow-md" />
            <span className="text-3xl font-bold tracking-wide drop-shadow-sm">InvenT</span>
        </div>

        {/* Imagen Principal */}
        <div className="flex-1 flex items-center justify-center z-10 py-10">
          <img
            src={carrito}
            alt="Ilustración de inventario"
            // Ajusté la altura a algo más estándar y responsivo.
            // Si h-150 era una clase personalizada tuya, ajústala aquí.
            className="w-full max-w-md h-auto object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>

      {/* --- LADO DERECHO (Formulario) --- */}
      <div className="flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md p-8 rounded-2xl ">
      {/* onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}*/}
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            iniciar(email, pass);
          }}
        >
          <div className="text-center mb-4">
            <h1 className="text-4xl font-black text-gray-900 mb-2">InventPRO</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Controla tu inventario de forma <span className="text-orange-500 font-bold">simple, rápida y segura</span>.
            </p>
          </div>

          {/* Input Group: Email */}
          <div className="flex items-center gap-2">
              <MdEmail size={23} className="text-gray-500" />
              <input
                  id="email"
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value)} }
                  className="
                  w-full
                  h-14
                  border-b-2 border-gray-300
                  px-4
                  hover:bg-gray-100
                  text-gray-900
                  placeholder:text-gray-400
                  focus:outline-none focus:border-orange-500 focus:bg-white
                  transition-all duration-200
                  rounded-t-md
                  "
              />
          </div>

           {/* Input Group: Password */}
          <div className="flex items-center gap-2">
            <TbLockPassword size={23} className="text-gray-500" />
            <input
                id="password"
                type="password"
                value={pass}
                onChange={(e) => { setPass(e.target.value)} }
                placeholder="Contraseña"
                className="
                w-full
                h-14
                border-b-2 border-gray-300
                px-4
              hover:bg-gray-100
                text-gray-900
                placeholder:text-gray-400
                focus:outline-none focus:border-orange-500 focus:bg-white
                transition-all duration-200
                rounded-t-md
                "
            />
          </div>

          {/* Olvidé mi contraseña link (opcional pero común) */}
          <div className="flex justify-end -mt-2">
              <a href="#" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                  ¿Olvidaste tu contraseña?
              </a>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="
              mt-4
              bg-orange-500 hover:bg-orange-400
              text-black
              text-lg
              font-bold
              h-14
              rounded-lg
              border-2 border-black
              /* Mantenemos tu estilo de sombra dura 'neo-brutalista' */
              shadow-[4px_4px_0px_#000]
              active:shadow-none
              active:translate-x-[4px] active:translate-y-[4px]
              transition-all duration-150
              disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0
              flex items-center justify-center gap-2
            "
          >
            {mutation.isPending ? (
                // Un pequeño spinner simple si está cargando
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            
            {mutation.isPending ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>
        </div>
      </div>
    </div>
  );
}