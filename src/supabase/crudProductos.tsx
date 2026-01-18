import { supabase } from "./supabase.config";
import Swal from "sweetalert2"

export interface InsertarProductoDTO {
  id : number;
  descripcion: string;
  idmarca: number;
  stock: number;
  stock_minimo: number;
  codigobarras: string ;
  codigointerno: string;
  precioventa: number;
  preciocompra: number;
  id_categoria: number;
  id_empresa: number;
}

export interface InsertarProducto {
  _descripcion: string;
  _id_marca: number;
  _stock: number;
  _stock_minimo: number;
  _codigo_barras: string ;
  _codigo_interno: string;
  _precio_venta: number;
  _precio_compra: number;
  _id_categoria: number;
  _id_empresa: number;
}

export async function InsertarProductos( p : InsertarProducto ) {
    const {error} = await supabase.rpc("insertar_producto", p)
    if(error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            footer: '<a href="">Agregue una nueva descripcion</a>',
          });
    }
}

export async function MostrarProductos( IdEmpresa : number ) { 
     const { data } = await supabase
      .from("productos")
      .select()
      .eq("id_empresa", IdEmpresa)
      .order("id", { ascending: true });
    return data;
}

export async function EliminarProductos( Id : number ) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el Producto permanentemente",
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
      .from("productos")
      .delete()
      .eq("id", Id);
    if (error) {
      await Swal.fire({
            icon: "error",
            title: "Error al eliminar el producto",
            text: error.message,
          });
          return false;
    }
}

export async function EditarProductos( p: InsertarProductoDTO) {
    const { error } = await supabase
      .from("productos")
      .update(p)
      .eq("id", p.id);
    if (error) {
        await Swal.fire({
          icon: "error",
          title: "Error al editar el producto",
          text: error.message,
        });
        return false;
    }
    
    return true;
}