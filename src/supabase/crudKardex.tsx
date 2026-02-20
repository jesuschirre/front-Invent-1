import { supabase } from "./supabase.config";
import Swal from "sweetalert2"

interface KardexItem {
  _fecha: string;
  _tipo: string;
  _cantidad: number;
  _id_producto: number;
  _id_empresa: number
  _id_usuario: number;
  _detalles: string;
}
export const MostrarKardex = async (id_empresa: number) => {
  const { data, error } = await supabase
    .from("kardex")
    .select(`
      *,
      id_producto!left(descripcion),
      id_usuario!left(nombres)
    `)
    .eq("id_empresa", id_empresa)
    .order("id", { ascending: true });

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al obtener el kardex: " + error.message,
    });
    return null;
  }

  return data;
};


export const InsertarKardex = async (k: KardexItem) => {
  // Usamos RPC para que la inserción y el update del stock sean una sola operación
  const { error } = await supabase.rpc("procesar_kardex", {
    _id_producto: k._id_producto,
    _id_usuario: k._id_usuario,
    _id_empresa: k._id_empresa,
    _cantidad: k._cantidad,
    _tipo: k._tipo.toLowerCase(), // Forzamos minúsculas para evitar errores
    _detalles: k._detalles,
    _fecha: k._fecha
  });

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error en movimiento",
      text: error.message,
    });
    return false;
  }

  return true;
};