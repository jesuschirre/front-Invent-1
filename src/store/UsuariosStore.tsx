import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import Swal from "sweetalert2";
import { InsertarUsuarios } from "../supabase/crudUsuarios";
import {type User } from "@supabase/supabase-js";
import { MostrarUsuarios } from "../supabase/crudUsuarios";

interface LoginParams {
  email: string;
  pass: string;
}
interface UsuarioStore {
  idusuario: number;
  InsertUsuAdmin: (p: LoginParams) => Promise<User | null>;
  mostrarUsuarios: () => Promise<any>;
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({

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
  
}));