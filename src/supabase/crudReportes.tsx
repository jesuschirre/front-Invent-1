import { supabase } from "./supabase.config";

export interface productos {
  descripcion:string;
}

export interface Usuarios {
  nombres:string;
}

export interface kardexmovimientos {
  id: number;
  fecha:string;
  tipo:string;
  cantidad:number;
  detalles: string;
  productos: productos[];
  usuarios: Usuarios[];
}

export const ReporteInventarioActual = async (id_empresa: number) => {
  const { data, error } = await supabase
    .from("productos")
    .select("id, descripcion, stock")
    .eq("id_empresa", id_empresa)
    .order("descripcion");

  if (error) throw error;
  return data;
};

export const ReporteMovimientos = async (
  id_empresa: number,
  fechaInicio: string,
  fechaFin: string
): Promise<kardexmovimientos[] | null> => {
  const { data, error } = await supabase
    .from("kardex")
    .select(`
      id,
      fecha,
      tipo,
      cantidad,
      detalles,
      productos: id_producto (descripcion),
      usuarios: id_usuario (nombres)
    `)
    .eq("id_empresa", id_empresa)
    .gte("fecha", fechaInicio)
    .lte("fecha", fechaFin)
    .order("fecha", { ascending: true });

  if (error) throw error;

  return data;
};

export const ReporteKardexProducto = async (
  id_empresa: number,
  id_producto: number
) => {
  const { data, error } = await supabase
    .from("kardex")
    .select(`
      fecha,
      tipo,
      cantidad,
      detalles,
      usuarios: id_usuario (nombres)
    `)
    .eq("id_empresa", id_empresa)
    .eq("id_producto", id_producto)
    .order("fecha");

  if (error) throw error;
  return data;
};