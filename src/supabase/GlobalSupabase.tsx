import { supabase } from "./supabase.config";

export const ObtenerIdAuthSupabase =async ()=>{
    const {data:{session}} = await supabase.auth.getSession();
    if(session != null){
        const{user}= session;
        const idAuthSupabase = user.id;
        return idAuthSupabase;
    }
}

export const ObtenerIdUsuario = async (): Promise<number | null> => {
  const UUID = await ObtenerIdAuthSupabase();

  if (!UUID) return null;

  const { data, error } = await supabase
    .from("usuarios")
    .select("id")
    .eq("idauth", UUID)
    .single();

  if (error || !data) {
    console.error("Error al obtener usuario:", error?.message);
    return null;
  }

  return data.id;
};

export const ObtenerIdUsuarioArg = async (UUID: string) => {  
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .eq("idauth", UUID)
      .maybeSingle(); // Usamos maybeSingle para evitar bloqueos

    if (error) {
      console.error("❌ Error de Supabase:", error.message);
      return null;
    }
    return data?.id || null;
  } catch (e) {
    console.error("❌ Error crítico en ObtenerIdUsuarioArg:", e);
    return null;
  }
};