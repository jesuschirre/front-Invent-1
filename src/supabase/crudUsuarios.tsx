import { supabase } from "./supabase.config";
import { ObtenerIdAuthSupabase } from "./GlobalSupabase";

interface UsuarioInsert {
  idauth: string;
  fecharegistro: Date;
  tipouser: string;
}

export const InsertarUsuarios = async (p: UsuarioInsert) => {
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
    .from("usuarios")
    // El '*' trae todas las columnas de 'usuarios'
    // 'idauth (Email)' trae la relación
    .select(`*, idauth (Email)`) 
    .eq("id_empresa", id_empresa)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return null;
  }
  return data;
}