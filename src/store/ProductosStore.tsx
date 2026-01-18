import { create } from "zustand";
import { InsertarProductos, MostrarProductos, type InsertarProductoDTO, type InsertarProducto, EliminarProductos, EditarProductos } from "../supabase/crudProductos";

interface ProductoStore { 
    dataproductos: InsertarProductoDTO[] ;
    parametros: number | null

    mostrarproductos: (id_empresa : number) => Promise<InsertarProductoDTO[]>;
    insertarproductos: (p: InsertarProducto) => Promise<void>;
    eliminarproductos: (id: number) => Promise<void>;
    editarproductos: (p: InsertarProductoDTO) => Promise<boolean>;
}

export const useProductosStore = create<ProductoStore>((set, get) => ({ 
  dataproductos: [],
  parametros: null,
  mostrarproductos: async (id_empresa : number) => {
    const response = await MostrarProductos(id_empresa);
    set({ parametros: id_empresa });
    set({ dataproductos: response ?? []});
    return response ?? [];
  },
  insertarproductos: async (p: InsertarProducto) => {
    await InsertarProductos (p);
    const { parametros, mostrarproductos } = get();
    if (parametros) {
      await mostrarproductos(parametros); 
    }
  },
  eliminarproductos: async ( id : number) => {
    await EliminarProductos(id);
    const { parametros, mostrarproductos } = get();
    if (parametros) {
      await mostrarproductos(parametros); 
    }
  },
  editarproductos: async ( p : InsertarProductoDTO ) => {
    const response = await EditarProductos(p);
    const { parametros, mostrarproductos } = get();
    if (parametros) {
      await mostrarproductos(parametros); 
    }
    if (response) {
      return true
    } else {
      return false
    }
  }

}))