import { supabase } from "./supabase.config";
import Swal from "sweetalert2"

export interface InterfaceCatego {
    id: number;
    nombre: string;
    descripcion: string;
    id_empresa: number;
    color:string
}

export async function InsertarCategorias(p: InterfaceCatego) {
    const {error} = await supabase.rpc("insertarcategorias",p)
    if(error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            footer: '<a href="">Agregue una nueva descripcion</a>',
          });
      return false;
    }
    return true;
}

export async function MostrarCategorias(IdEmpresa : number ) {
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("id_empresa", IdEmpresa)
      .order("id", { ascending: true });
    return data;
}

export async function EliminarCategorias(Id : number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la categoria permanentemente",
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
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", Id);

  if (error) {
    await Swal.fire({
      icon: "error",
      title: "Error al eliminar la categoria",
      text: error.message,
    });
    return false;
  }

  await Swal.fire({
    icon: "success",
    title: "Categoria eliminada",
    timer: 1500,
    showConfirmButton: false,
  });

  return true;
}

export async function EditarCategorias(p: InterfaceCatego) {
    const { error } = await supabase
      .from("categorias")
      .update(p)
      .eq("id", p.id);
    if (error) {
        await Swal.fire({
          icon: "error",
          title: "Error al editar la categoria",
          text: error.message,
        });
        return false;
    }
    return true;
}