import { supabase } from "../supabase/supabase.config";

interface Modulo {
  id: number;
  nombre: string;
}

export const modulosUsu = async (idUsuario: number): Promise<Modulo[]> => {
  const { data, error } = await supabase
    .from("permisos")
    .select(`
      idmodulo,
      modulos (
        id,
        nombre
      )
    `)
    .eq("id_usuario", idUsuario);

  if (error || !data) {
    console.error("Error al obtener módulos:", error?.message);
    return [];
  }
  
  return data
    .map((row: any) => row.modulos)
    .filter(Boolean);
};
