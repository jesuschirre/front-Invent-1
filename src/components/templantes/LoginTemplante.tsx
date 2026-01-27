import { useNavigate } from "react-router-dom";
import inventario from "../../assets/invent2.jpg";
import { TbLockPassword } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import { UseAuthStore } from "../../store/authStore";
import { GrRotateLeft, GrLogin } from "react-icons/gr";
import Swal from "sweetalert2";
//import { useUsuarioStore } from "../../store/UsuariosStore";
//import { useMutation } from "@tanstack/react-query";

export default function LoginTemplante() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { signInWithEmail } = UseAuthStore();
  const [loading, setLoading] = useState(false);

  //const InsertUsuAdmin = useUsuarioStore(
  //  (state) => state.InsertUsuAdmin
  //);

  async function iniciar(email: string, Pass: string) {
    try {
      setLoading(true);
      const response = await signInWithEmail({ correo: email, pass: Pass });
      
      if (response) {
        navigate("/");
      } else {
        // Si la respuesta es null o false (dependiendo de tu store)
        lanzarError("CREDENCIALES INVÁLIDAS", "El correo o la contraseña no coinciden con nuestros registros.");
      }
    } catch (error: any) {
      // Manejo de errores específicos de Supabase o red
      console.error(error);
      lanzarError("ERROR DE CONEXIÓN", error.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Helper para mantener el estilo Neo-brutalista en los mensajes
  const lanzarError = (titulo: string, texto: string) => {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "error",
      confirmButtonText: "REINTENTAR",
      confirmButtonColor: "#000000",
      background: "#ffffff",
      customClass: {
        popup: "border-8 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(255,0,0,1)]",
        title: "font-black uppercase italic text-3xl tracking-tighter",
        htmlContainer: "font-bold uppercase text-xs tracking-widest",
        confirmButton: "border-4 border-black rounded-none font-black px-10 py-4 hover:bg-red-500 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]",
      },
    });
  };

  //const mutation = useMutation({
    //mutationKey: ["insert-usuario-admin"],
    //mutationFn: async () => {
     // return await InsertUsuAdmin({
     //   email: "qopa4@airsworld.net",
      //  pass: "123456",
      //});
    //},
    //onSuccess: (data) => {
    //  if (data) navigate("/");
    //},
  //});
  const inputStyles = `
    w-full h-14 bg-white border-4 border-black px-11
    font-black uppercase text-sm outline-none
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]
    transition-all placeholder:text-gray-400
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white dark:bg-zinc-950">
      
      {/* --- LADO IZQUIERDO (Neo-Brutalismo Branding) --- */}
      <div className="hidden md:flex relative overflow-hidden bg-[#fee685] border-r-8 border-black flex-col justify-between p-12">
        <div 
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img 
            src={inventario} 
            className="w-full h-auto object-contain grayscale contrast-125 mix-blend-multiply opacity-20 rotate-[-5deg] scale-110" 
          />
        </div>

        <div className="z-10">
          <div className="bg-black text-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <span className="text-sm font-black uppercase tracking-[0.3em]">Acceso Seguro</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8] text-black">
            INVENTARIO<br />
          </h1>
        </div>
      </div>

      {/* --- LADO DERECHO (Formulario Neo-Brutalista) --- */}
      <div className="flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-8 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-2 dark:text-white">
              Login<span className="text-[#fee685]">_</span>
            </h2>
            <p className="font-bold text-gray-500 uppercase text-[10px] tracking-[0.2em]">
              Introduce tus credenciales para continuar
            </p>
          </div>
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
            {/* Input: Email */}
            <div className="relative flex items-center">
              <MdEmail size={20} className="absolute left-4 z-10 text-black" />
              <input
                type="email"
                placeholder="TU CORREO"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyles}
                required
              />
            </div>

            {/* Input: Password */}
            <div className="relative flex items-center">
              <TbLockPassword size={20} className="absolute left-4 z-10 text-black" />
              <input
                type="password"
                placeholder="TU CONTRASEÑA"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className={inputStyles}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-4 h-16 border-4 border-black bg-[#fee685]
                font-black uppercase text-lg tracking-widest
                shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                hover:bg-yellow-400 active:shadow-none
                active:translate-x-[4px] active:translate-y-[4px]
                transition-all flex items-center justify-center gap-3
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
              "
            >
              {loading ? (
                <GrRotateLeft className="animate-spin" size={24} />
              ) : (
                <GrLogin size={24} />
              )}
              <span>{loading ? "PROCESANDO..." : "ENTRAR"}</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}