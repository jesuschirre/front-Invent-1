import { supabase } from "./supabase.config";
import Swal from "sweetalert2"

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


export const InsertarKardex = async (k) => {

  // 1️⃣ Insertar movimiento en kardex
  const { data, error } = await supabase
    .from("kardex")
    .insert(k)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Obtener stock actual del producto
  const { data: producto, error: errorProducto } = await supabase
    .from("productos")
    .select("stock")
    .eq("id", k.id_producto)
    .single();

  if (errorProducto) {
    throw errorProducto;
  }

  // Calcular nuevo stock
  let nuevoStock = producto.stock;

  if (k.tipo === "entrada") {
    nuevoStock += k.cantidad;
  } else if (k.tipo === "salida") {
    nuevoStock -= k.cantidad;
  }

  // Actualizar stock
  const { error: errorUpdate } = await supabase
    .from("productos")
    .update({ stock: nuevoStock })
    .eq("id", k.id_producto);

  if (errorUpdate) {
    throw errorUpdate;
  }

  return data;
};