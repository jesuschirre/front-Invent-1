import { supabase } from "./supabase.config";
import Swal from "sweetalert2"

export interface Marca {
  id: number;
  descripcion: string;
  id_empresa: number;
}

export interface DatosInsert {
    _descripcion: string;
    _idempresa: number;
}

export async function InsertarMarca(
  p: DatosInsert
): Promise<boolean> {

  const { error } = await supabase.rpc("insertarmarca", p);

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: "Agregue una nueva descripción",
    });
    return false;
  }

  return true;
}

export async function MostrarMarca(id_empresa: number) {
 
    const { data } = await supabase
      .from("marca")
      .select()
      .eq("id_empresa", id_empresa)
      .order("id", { ascending: true });
    return data;
  
}
export async function EliminarMarca(Id: number) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará la marca permanentemente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  // Si cancela, no pasa nada
  if (!result.isConfirmed) {
    return false;
  }

  // Si confirma, se elimina
  const { error } = await supabase
    .from("marca")
    .delete()
    .eq("id", Id);

  if (error) {
    await Swal.fire({
      icon: "error",
      title: "Error al eliminar la marca",
      text: error.message,
    });
    return false;
  }

  await Swal.fire({
    icon: "success",
    title: "Marca eliminada",
    timer: 1500,
    showConfirmButton: false,
  });

  return true;
}

export async function EditarMarca( p: Marca) {
    const { error } = await supabase
      .from("marca")
      .update(p)
      .eq("id", p.id);
      
      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Error al editar la marca",
          text: error.message,
        });
        return false;
      }
    
}

export async function BuscarMarca(p) {
    const { data} = await supabase
    .from("marca")
    .select()
    .eq("id_empresa", p.id_empresa)
    .ilike("descripcion","%"+p.descripcion+"%")
    return data;
}