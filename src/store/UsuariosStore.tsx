import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import Swal from "sweetalert2";
import { EditarUsuarios, EliminarPermisos, EliminarUsuarios, InsertarAsignaciones, InsertarPermisos, InsertarUsuarios, MostrarModulos, MostrarPermisos, MostrarUsuariosTodos } from "../supabase/crudUsuarios";
import {type User } from "@supabase/supabase-js";
import { MostrarUsuarios } from "../supabase/crudUsuarios";
import { type Modulo } from "../components/organismos/form/ModalInsertUsuario";
interface LoginParams {
  email: string;
  pass: string;
}

export interface InterfaceUsuarios {
  id: number;
  nombres: string;
  correo: string;
  direccion: string;
  estado: string;
  fecharegistro: string;
  nro_doc: string;
  tipodoc: string;
  tipouser: string;
  telefono:string;
  idauth:string;
}
export interface InterfaceInsertUsuarios {
  nombres: string;
  correo: string;
  direccion: string;
  estado: string;
  nro_doc: string;
  tipodoc: string;
  tipouser: string;
  telefono:string;
}


interface UsuarioStore {
  idusuario: number;
  InsertUsuAdmin: (p: LoginParams) => Promise<User | null>;
  mostrarUsuarios: () => Promise<any>;

  parametros: number | null
  datausuarios: InterfaceUsuarios[]
  datamodulos: Modulo[]
  insertarusuarios: (  parametrosAuth : LoginParams, p: InterfaceInsertUsuarios,
    datacheckpermisos : Modulo[],
    id_empresa: number) => Promise <boolean>
  Usuariosdeempresa: (Id_empresa: number) => Promise <any>;
  mostrarModulos: () => Promise <any>
  mostrarpermisos: (id: number) => Promise <any>
  eliminarusuario: (id: number) => Promise<any>
  editarusuarios: (p: InterfaceUsuarios, datacheckpermisos: Modulo[]) => Promise<boolean>
}

export const useUsuarioStore = create<UsuarioStore>((set, get) => ({
  

  InsertUsuAdmin: async (p: LoginParams) => {
    const { data, error } = await supabase.auth.signUp({
      email: p.email,
      password: p.pass
    });

    // Error al crear usuario auth
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      return null;
    }

    // Usuario aún no confirmado
    if (!data.user) {
      Swal.fire({
        icon: "info",
        title: "Verificación requerida",
        text: "Revisa tu correo para confirmar la cuenta",
      });
      return null;
    }
    // Insertar en tabla usuarios
    const usuarioDB = await InsertarUsuarios({
      idauth: data.user.id,
      fecharegistro: new Date(),
      tipouser: "admin",
    });

    if (!usuarioDB) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El usuario se creó, pero no se pudo registrar en la base de datos",
      });
      return null;
    }

    Swal.fire({
      icon: "success",
      title: "Usuario creado",
      text: "Administrador registrado correctamente",
    });

    return usuarioDB;
  },
  // Estado
  idusuario: 0,
  // Acción
  mostrarUsuarios: async () => {
    const response = await MostrarUsuarios();
    set({ idusuario: response.id });
    return response;
  },
  datausuarios: [],
  parametros: null,
  Usuariosdeempresa: async (Id_empresa: number) => {
    const response = await MostrarUsuariosTodos(Id_empresa);

    const usuarios: InterfaceUsuarios[] =
      response?.flatMap(item => item.id_usuario) ?? [];

    set({
      datausuarios: usuarios,
      parametros: Id_empresa
    });

    return usuarios;
  },

  insertarusuarios: async (
    parametrosAuth : LoginParams,
    p: InterfaceInsertUsuarios,
    datacheckpermisos : Modulo[],
    id_empresa: number
  ) => {
    try {
      /* =========================
        1. CREAR AUTH
      ========================== */
      const { data, error } = await supabase.auth.signUp({
        email: parametrosAuth.email,
        password: parametrosAuth.pass,
      });

      if (error) { return false};
      if (!data.user) throw new Error("Usuario no confirmado");

      /* =========================
        2. CREAR USUARIO DB
      ========================== */
      const dataUserNew = await InsertarUsuarios({
        nombres: p.nombres,
        nro_doc: p.nro_doc,
        telefono: p.telefono,
        direccion: p.direccion,
        fecharegistro: new Date(),
        estado: "activo",
        idauth: data.user.id,
        tipouser: p.tipouser,
        tipodoc: p.tipodoc,
        correo: p.correo,
      });

      if (!dataUserNew) {
        throw new Error("No se pudo crear el usuario");
      }

      /* =========================
        3. ASIGNAR EMPRESA
      ========================== */
      await InsertarAsignaciones({
        id_empresa,
        id_usuario: Number(dataUserNew.id),
      });

      /* =========================
        4. ASIGNAR PERMISOS
      ========================== */
      const permisosActivos = datacheckpermisos.filter(p => p.check);

      for (const permiso of permisosActivos) {
        await InsertarPermisos({
          id_usuario: dataUserNew.id,
          idmodulo: permiso.id,
        });
      }

      const { parametros, Usuariosdeempresa } = get();
       if (parametros) {
        await Usuariosdeempresa(parametros); 
      }

      return true;

    } catch (error: any) {
      console.error("Error al crear usuario:", error.message);
      return false;
    }
  },

  eliminarusuario: async (id:number) => {
    await EliminarUsuarios(id)
    const { parametros, Usuariosdeempresa } = get();
       if (parametros) {
        await Usuariosdeempresa(parametros); 
    }
  },

  editarusuarios: async (p: InterfaceUsuarios, datacheckpermisos: Modulo[]) => {
    const res = await EditarUsuarios(p);
    if (!res) {return false}
    const elim = await EliminarPermisos({ id_usuario: p.id });
    if (!elim) {return false}
    datacheckpermisos.forEach(async (item) => {
      if (item.check) {
        let parametrospermisos = {
          id_usuario: p.id,
          idmodulo: item.id,
        };
        const insert = await InsertarPermisos(parametrospermisos);
        if (!insert) {return false}
      }
    });
    const { parametros, Usuariosdeempresa } = get();
       if (parametros) {
        await Usuariosdeempresa(parametros); 
    }
    return true;
  },


  mostrarpermisos: async (id: number) => {
    const response = await MostrarPermisos(id);

    return response;
  },

  datamodulos:[],
  mostrarModulos: async () => {
    const response = await MostrarModulos();
    set({ datamodulos: response ?? []})
    return response;
  }, 

}));