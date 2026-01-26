import { useEffect, useState } from "react";
import { useUsuarioStore } from "../../../store/UsuariosStore";
import { UserAuth } from "../../../context/AuthContext";
import { GrClose, GrShieldSecurity, GrUser, GrKey, GrRotateLeft, GrSave } from "react-icons/gr";
import Swal from "sweetalert2";

interface modalUsu {
  onClose: () => void;
}

export interface Modulo {
  id: number;
  nombre: string;
  check: boolean;
}

export default function ModalInsertUsuario({ onClose }: modalUsu) {
  const { mostrarModulos, datamodulos, insertarusuarios } = useUsuarioStore();
  const { empresa } = UserAuth();
  const [dataAuth, setDataAuth] = useState({ email: "", pass: "" });
  const [dataUsuarios, setDataUsuarios] = useState({
    correo: dataAuth.email,
    nombres: "",
    direccion: "",
    estado: "",
    telefono: "",
    nro_doc: "",
    tipodoc: "",
    tipouser: "usuario",
  });
  const [permisos, setPermisos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    mostrarModulos();
  }, [mostrarModulos]);

  useEffect(() => {
    if (datamodulos.length > 0) {
      setPermisos(
        datamodulos.map((m) => ({
          id: m.id,
          nombre: m.nombre,
          check: false,
        }))
      );
    }
  }, [datamodulos]);

  const validarFormulario = () => {
    // Credenciales
    if (!dataAuth.email || !dataAuth.pass) {
      Swal.fire("Faltan datos", "Complete email y contraseña", "warning");
      return false;
    }

    // Datos personales
    if (!dataUsuarios.nombres.trim()) {
      Swal.fire("Faltan datos", "Ingrese el nombre completo", "warning");
      return false;
    }

    if (!dataUsuarios.estado) {
      Swal.fire("Faltan datos", "Seleccione el estado del usuario", "warning");
      return false;
    }

    if (!dataUsuarios.tipodoc) {
      Swal.fire("Faltan datos", "Seleccione el tipo de documento", "warning");
      return false;
    }

    if (!dataUsuarios.nro_doc) {
      Swal.fire("Faltan datos", "Ingrese el número de documento", "warning");
      return false;
    }

    if (!dataUsuarios.telefono) {
      Swal.fire("Faltan datos", "Ingrese el teléfono", "warning");
      return false;
    }

    // Validaciones numéricas
    if (dataUsuarios.telefono.length !== 9) {
      Swal.fire("Teléfono inválido", "El teléfono debe tener 9 dígitos", "warning");
      return false;
    }

    if (
      dataUsuarios.tipodoc === "dni" &&
      dataUsuarios.nro_doc.length !== 8
    ) {
      Swal.fire("Documento inválido", "El DNI debe tener 8 dígitos", "warning");
      return false;
    }

    if (
      dataUsuarios.tipodoc === "ruc" &&
      dataUsuarios.nro_doc.length !== 11
    ) {
      Swal.fire("Documento inválido", "El RUC debe tener 11 dígitos", "warning");
      return false;
    }

    // Permisos
    const permisosSeleccionados = permisos.filter((p) => p.check);
    if (permisosSeleccionados.length === 0) {
      Swal.fire("Permisos requeridos", "Seleccione al menos un permiso", "warning");
      return false;
    }

    return true;
  };

  const formularioValido = () => {
    if (!dataAuth.email || !dataAuth.pass) return false;
    if (!dataUsuarios.nombres.trim()) return false;
    if (!dataUsuarios.estado) return false;
    if (!dataUsuarios.tipodoc) return false;
    if (!dataUsuarios.telefono || dataUsuarios.telefono.length !== 9) return false;
    if (!dataUsuarios.nro_doc) return false;

    if (
      dataUsuarios.tipodoc === "dni" &&
      dataUsuarios.nro_doc.length !== 8
    ) return false;

    if (
      dataUsuarios.tipodoc === "ruc" &&
      dataUsuarios.nro_doc.length !== 11
    ) return false;

    if (permisos.filter(p => p.check).length === 0) return false;

    return true;
  };
  
  const togglePermiso = (id: number) => {
    setPermisos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, check: !m.check } : m))
    );
  };

  const InsertarUsuarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;
    try {
      setLoading(true);
      const permisosSeleccionados = permisos.filter((p) => p.check);
      const res = await insertarusuarios(
        dataAuth,
        dataUsuarios,
        permisosSeleccionados,
        Number(empresa?.empresa.id)
      );
      onClose();
      if(res){
        await Swal.fire({
          icon: "success",
          title: "INSERTADO",
          text: "La información del usuario se guardo correctamente.",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No se pudo guardar al usuario",
        confirmButtonColor: "#000000",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border-4 border-black p-3 font-black uppercase text-sm focus:bg-[#fee685] outline-none transition-colors placeholder:text-gray-400 dark:bg-zinc-800 dark:text-white";
  const labelStyles = "text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* HEADER */}
        <div className="bg-[#fee685] border-b-4 border-black p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black">
              Nuevo Usuario
            </h2>
          </div>
          <button onClick={onClose} className="p-2 border-4 border-black bg-white hover:bg-red-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
            <GrClose size={24} />
          </button>
        </div>

        <form onSubmit={InsertarUsuarioSubmit} className="p-8 space-y-8">
          
          {/* SECCIÓN CREDENCIALES */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-2 mb-4">
              <GrKey className="dark:text-white" />
              <h3 className="font-black uppercase text-sm dark:text-white">Credenciales de Acceso</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Email Auth <span className="text-red-500">(*)</span> </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={dataAuth.email}
                  onChange={(e) => setDataAuth({ ...dataAuth, email: e.target.value })}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <label className={labelStyles}>Password <span className="text-red-500">(*)</span> </label>
                <input
                  type="password"
                  placeholder="********"
                  value={dataAuth.pass}
                  onChange={(e) => setDataAuth({ ...dataAuth, pass: e.target.value })}
                  className={inputStyles}
                  required
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN DATOS PERSONALES */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-2 mb-4">
              <GrUser className="dark:text-white" />
              <h3 className="font-black uppercase text-sm dark:text-white">Información del Perfil</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelStyles}>Nombre Completo <span className="text-red-500">(*)</span> </label>
                <input
                  placeholder="JUAN PEREZ"
                  value={dataUsuarios.nombres}
                  onChange={(e) => setDataUsuarios({ ...dataUsuarios, nombres: e.target.value })}
                  className={inputStyles}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Dirección <span className="text-red-500">(*)</span> </label>
                <input
                  placeholder="CALLE FALSA 123"
                  value={dataUsuarios.direccion}
                  onChange={(e) => setDataUsuarios({ ...dataUsuarios, direccion: e.target.value })}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Estado <span className="text-red-500">(*)</span></label>
                <select
                  value={dataUsuarios.estado}
                  onChange={(e) => setDataUsuarios({ ...dataUsuarios, estado: e.target.value })}
                  className={inputStyles}
                  required
                >
                  <option value="">SELECCIONAR</option>
                  <option value="activo">ACTIVO</option>
                  <option value="inactivo">INACTIVO</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>
                  Teléfono <span className="text-red-500">(*)</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="987654321"
                  value={dataUsuarios.telefono}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 9) {
                      setDataUsuarios({ ...dataUsuarios, telefono: value });
                    }
                  }}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Tipo Doc <span className="text-red-500">(*)</span></label>
                <select
                  value={dataUsuarios.tipodoc}
                  onChange={(e) => setDataUsuarios({ ...dataUsuarios, tipodoc: e.target.value })}
                  className={inputStyles}
                >
                  <option value="">SELECCIONAR</option>
                  <option value="dni">DNI</option>
                  <option value="ruc">RUC</option>
                  <option value="pasaporte">PASAPORTE</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>
                  N° Documento <span className="text-red-500">(*)</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00000000000"
                  value={dataUsuarios.nro_doc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // solo números
                    if (value.length <= 11) {
                      setDataUsuarios({ ...dataUsuarios, nro_doc: value });
                    }
                  }}
                  className={inputStyles}
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN PERMISOS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-2 mb-4">
              <GrShieldSecurity className="dark:text-white" />
              <h3 className="font-black uppercase text-sm dark:text-white">Asignación de Permisos <span className="text-red-500">(*)</span></h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {permisos.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => togglePermiso(m.id)}
                  className={`p-3 border-4 border-black font-black uppercase text-xs transition-all flex items-center gap-2
                    ${m.check 
                      ? "bg-green-400 shadow-none" 
                      : "bg-white dark:bg-zinc-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100"}`}
                >
                  <div className={`size-4 border-2 border-black ${m.check ? 'bg-black' : 'bg-white'}`} />
                  {m.nombre}
                </button>
              ))}
            </div>
          </section>

          {/* BOTONES ACCIÓN */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-3 pt-4 sticky bottom-0 bg-white dark:bg-zinc-900 py-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 font-black uppercase border-4 border-black bg-white hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formularioValido()}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
              bg-yellow-400 hover:bg-yellow-500 
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-none transition-all flex justify-center items-center gap-2 
              disabled:opacity-50">
              {loading ? <GrRotateLeft className="animate-spin" /> : <GrSave size={20} />}
              <span>{loading ? "Creando...." : "Guardar Cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}