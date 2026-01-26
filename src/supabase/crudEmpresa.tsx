import { supabase } from "./supabase.config";

export interface EmpresaAsignada {
  empresa: {
    id: number;
    nombre: string;
    simbolomone: string;
  };
}
export interface Empresa {
  id: number;
  nombre: string;
  simbolomone: string;
  estado?: string;
}


export const MostrarEmpresa = async (
  idUsu: number
): Promise<EmpresaAsignada | null> => {

  const { data, error } = await supabase
    .from("asignarempresa")
    .select("empresa(id,nombre,simbolomone)")
    .eq("id_usuario", idUsu)
    .returns<EmpresaAsignada[]>(); // CLAVE
  if (error) {
    console.error("Error al obtener empresa:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};

export const EditarEmpresa = async (
  empresa: Empresa
): Promise<boolean> => {
  const { id, ...data } = empresa;
  const { error } = await supabase
    .from("empresa")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error al editar empresa:", error.message);
    return false;
  }

  return true;
};

export const ContarUsuariosXempresa = async (
  idEmpresa: number
): Promise<number> => {

  if (!idEmpresa) {
    console.warn("IdEmpresa inválido:", idEmpresa);
    return 0;
  }

  const { data, error } = await supabase.rpc(
    "contar_usuarios_por_empresa",
    {
      _id_empresa: idEmpresa,
    }
  );

  if (error) {
    console.error("Error RPC:", error.message);
    return 0;
  }

  return data ?? 0;
};