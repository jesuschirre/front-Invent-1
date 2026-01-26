import { supabase } from "./supabase.config";
import { ObtenerIdAuthSupabase } from "./GlobalSupabase";
import {type InterfaceUsuarios } from "../store/UsuariosStore";
import Swal from "sweetalert2"

interface UsuarioInsert {
  idauth: string;
  fecharegistro: Date;
  tipouser: string;
}
interface asig {
  id_empresa: number
  id_usuario:number
}
interface p {
  id_usuario:number
}

interface permi {
  id_usuario: number
  idmodulo: number
}

export const InsertarUsuarios = async (p: InterfaceUsuarios | UsuarioInsert) => {
  const { data, error } = await supabase
    .from("usuarios")
    .insert(p)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
};

export const MostrarUsuarios = async () => {
  const idAuthSupabase = await ObtenerIdAuthSupabase();
  const {  data } = await supabase
    .from("usuarios")
    .select()
    .eq("idauth", idAuthSupabase)
    .maybeSingle();

  if (data) {
    return data;
  }
};

export const MostrarUsuariosTodos = async (id_empresa: number) => {
  const { data, error } = await supabase
    .from("asignarempresa")
    .select(`id_usuario (*)`) 
    .eq("id_empresa", id_empresa)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return null;
  }
  return data;
}

export const EliminarUsuarios = async (id_usu: number) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el usuario permanentemente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return false;

  try {
    // Permisos
    const { error: errorPermisos } = await supabase
      .from("permisos")
      .delete()
      .eq("id_usuario", id_usu);

    if (errorPermisos) throw errorPermisos;

    // Asignación empresa
    const { error: errorAsignacion } = await supabase
      .from("asignarempresa")
      .delete()
      .eq("id_usuario", id_usu);

    if (errorAsignacion) throw errorAsignacion;

    // Usuario de la tabla usuarios
    const { error: errorUsuario } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id_usu);

    if (errorUsuario) throw errorUsuario;

    Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
    return true;

  } catch (error: any) {
    Swal.fire(
      "Error",
      error.message || "No se pudo eliminar el usuario",
      "error"
    );
    return false;
  }
};

export const EditarUsuarios = async ( p : InterfaceUsuarios) => {
  const { error } = await supabase
    .from("usuarios")
    .update(p)
    .eq("id", p.id);

   if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al editar usuario " + error.message,
    });
    return false;
  }
  return true;
}

export async function EliminarPermisos( p : p ) {
  const { error } = await supabase
    .from("permisos")
    .delete()
    .eq("id_usuario", p.id_usuario);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al eliminar permisos" + error.message,
    });
    return false;
  }
  return true;
}

export const InsertarAsignaciones = async ( p: asig ) => {
  const {  error } = await supabase
    .from("asignarempresa")
    .insert(p)
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al insertar usuario " + error.message,
    });
  }
 
};

export async function MostrarPermisos(id_usuario: number) {

  const { data } = await supabase
    .from("permisos")
    .select(`id, id_usuario, idmodulo, modulos(nombre)`)
    .eq("id_usuario", id_usuario)
  
  return data;
}

export async function InsertarPermisos( p: permi ) {

  const {  error } = await supabase
    .from("permisos")
    .insert(p)
    
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al insertar permisos "+ error.message,
      footer: '<a href="">error</a>',
    });
    return false;
  }
  return true;
}


export async function MostrarModulos() {
  
  const { data } = await supabase.from("modulos").select();
  return data;

}