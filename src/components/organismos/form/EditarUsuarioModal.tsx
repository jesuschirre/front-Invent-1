import { useEffect, useState } from "react";
import { useUsuarioStore } from "../../../store/UsuariosStore";
import type { InterfaceUsuarios } from "../../../store/UsuariosStore";
import { GrClose, GrShieldSecurity, GrUser, GrRotateLeft } from "react-icons/gr";
import Swal from "sweetalert2";

interface Props {
  usuario: InterfaceUsuarios;
  onClose: () => void;
}

export default function EditarUsuarioModal({ usuario, onClose }: Props) {
  const { mostrarModulos, mostrarpermisos , editarusuarios } = useUsuarioStore();
  const [editUsu, setEditUsu] = useState(usuario);
  const [modulos, setModulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const permisos = await mostrarpermisos(usuario.id);
        const modulos = await mostrarModulos();
        if (modulos && Array.isArray(modulos)) {
          const modulosConEstado = modulos.map(modulo => {
            const tienePermiso = (permisos )?.some((p: any) => p.idmodulo === modulo.id);
            return { ...modulo, check: tienePermiso || false };
          });
          setModulos(modulosConEstado);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [ mostrarModulos, mostrarpermisos, usuario.id]);

  const togglePermiso = (idModulo: number) => {
    setModulos(prev => prev.map(m => m.id === idModulo ? { ...m, check: !m.check } : m));
  };

  const formularioValido = () => {
    if (!editUsu.nombres.trim()) return false;
    if (!editUsu.estado) return false;
    if (!editUsu.tipodoc) return false;
    if (!editUsu.telefono || editUsu.telefono.length !== 9) return false;
    if (!editUsu.nro_doc) return false;

    if (
      editUsu.tipodoc === "dni" &&
      editUsu.nro_doc.length !== 8
    ) return false;

    if (
      editUsu.tipodoc === "ruc" &&
      editUsu.nro_doc.length !== 11
    ) return false;

    if (modulos.filter(p => p.check).length === 0) return false;

    return true;
  };
  const validarFormulario = () => {
    // Datos personales
    if (!editUsu.nombres.trim()) {
      Swal.fire("Faltan datos", "Ingrese el nombre completo", "warning");
      return false;
    }

    if (!editUsu.estado) {
      Swal.fire("Faltan datos", "Seleccione el estado del usuario", "warning");
      return false;
    }

    if (!editUsu.tipodoc) {
      Swal.fire("Faltan datos", "Seleccione el tipo de documento", "warning");
      return false;
    }

    if (!editUsu.nro_doc) {
      Swal.fire("Faltan datos", "Ingrese el número de documento", "warning");
      return false;
    }

    if (!editUsu.telefono) {
      Swal.fire("Faltan datos", "Ingrese el teléfono", "warning");
      return false;
    }

    // Validaciones numéricas
    if (editUsu.telefono.length !== 9) {
      Swal.fire("Teléfono inválido", "El teléfono debe tener 9 dígitos", "warning");
      return false;
    }

    if (
      editUsu.tipodoc === "dni" &&
      editUsu.nro_doc.length !== 8
    ) {
      Swal.fire("Documento inválido", "El DNI debe tener 8 dígitos", "warning");
      return false;
    }

    if (
      editUsu.tipodoc === "ruc" &&
      editUsu.nro_doc.length !== 11
    ) {
      Swal.fire("Documento inválido", "El RUC debe tener 11 dígitos", "warning");
      return false;
    }

    // Permisos
    const permisosSeleccionados = modulos.filter((p) => p.check);
    if (permisosSeleccionados.length === 0) {
      Swal.fire("Permisos requeridos", "Seleccione al menos un permiso", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    try {
      setLoading(true);
      const res = await editarusuarios(editUsu, modulos);
      onClose();
      if (res) {
        await Swal.fire({
          icon: "success",
          title: "¡ACTUALIZADO!",
          text: "La información del usuario se sincronizó correctamente.",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No se pudo actualizar el usuario",
        confirmButtonColor: "#000000",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border-4 border-black p-3 font-black uppercase text-sm focus:bg-[#fee685] outline-none transition-colors dark:bg-zinc-800 dark:text-white";
  const labelStyles = "text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* HEADER */}
        <div className="bg-[#fee685] border-b-4 border-black p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black">
              Editar Perfil
            </h2>
            <p className="text-[10px] font-bold uppercase text-black/60 italic">ID: {usuario.id}</p>
          </div>
          <button onClick={onClose} className="p-2 border-4 border-black bg-white hover:bg-red-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
            <GrClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* SECCIÓN INFORMACIÓN GENERAL */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-2 mb-4">
              <GrUser className="dark:text-white" />
              <h3 className="font-black uppercase text-sm dark:text-white">Datos del Usuario</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelStyles}>Correo Electrónico <span className="text-red-500">(*)</span></label>
                <input
                  type="email"
                  value={editUsu.correo}
                  onChange={(e) => setEditUsu({ ...editUsu, correo: e.target.value })}
                  className={inputStyles}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Nombres Completos <span className="text-red-500">(*)</span></label>
                <input
                  value={editUsu.nombres}
                  onChange={(e) => setEditUsu({ ...editUsu, nombres: e.target.value })}
                  className={inputStyles}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyles}>Dirección Residencia <span className="text-red-500">(*)</span></label>
                <input
                  value={editUsu.direccion || ""}
                  onChange={(e) => setEditUsu({ ...editUsu, direccion: e.target.value })}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Estado de Cuenta <span className="text-red-500">(*)</span></label>
                <select
                  value={editUsu.estado}
                  onChange={(e) => setEditUsu({ ...editUsu, estado: e.target.value })}
                  className={inputStyles}
                  required
                >
                  <option value="activo">ACTIVO</option>
                  <option value="inactivo">INACTIVO</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>Teléfono Contacto <span className="text-red-500">(*)</span></label>
                <input
                  value={editUsu.telefono || ""}
                  type="text"
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 9) {
                      setEditUsu({ ...editUsu, telefono: value });
                    }
                  }}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Tipo Documento <span className="text-red-500">(*)</span></label>
                <select
                  value={editUsu.tipodoc || ""}
                  onChange={(e) => setEditUsu({ ...editUsu, tipodoc: e.target.value })}
                  className={inputStyles}
                >
                  <option value="dni">DNI</option>
                  <option value="ruc">RUC</option>
                  <option value="pasaporte">PASAPORTE</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>Número Documento <span className="text-red-500">(*)</span></label>
                <input
                  value={editUsu.nro_doc || ""}
                  inputMode="numeric"
                  placeholder="00000000000"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // solo números
                    if (value.length <= 11) {
                      setEditUsu({ ...editUsu, nro_doc: value });
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
              <h3 className="font-black uppercase text-sm dark:text-white">Gestión de Accesos <span className="text-red-500">(*)</span></h3>
            </div>
            
            {loading && modulos.length === 0 ? (
              <div className="p-4 border-4 border-black border-dashed text-center font-bold animate-pulse">
                Sincronizando módulos...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {modulos.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => togglePermiso(m.id)}
                    className={`p-3 border-4 border-black font-black uppercase text-xs transition-all flex items-center gap-2
                      ${m.check 
                        ? "bg-green-400 shadow-none text-black" 
                        : "bg-white dark:bg-zinc-800 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100"}`}
                  >
                    <div className={`size-4 border-2 border-black ${m.check ? 'bg-black' : 'bg-white'}`} />
                    {m.nombre || `Módulo ${m.id}`}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* BOTONES ACCIÓN */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-3 pt-4 sticky bottom-0 bg-white dark:bg-zinc-900 py-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full md:w-1/3 p-4 border-4 border-black font-black uppercase bg-white hover:bg-gray-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading || !formularioValido()}
              className="w-full md:w-2/3 p-4 border-4 border-black font-black uppercase 
              bg-yellow-400 hover:bg-yellow-500 
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-none transition-all flex justify-center items-center gap-2 
              disabled:opacity-50">
              {loading && <GrRotateLeft className="animate-spin" />}
              {loading ? "Actualizando..." : "Confirmar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}