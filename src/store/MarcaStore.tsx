import { create } from "zustand";
import { EditarMarca, EliminarMarca, InsertarMarca, MostrarMarca } from "../supabase/crudMarca";
import type { Marca } from "../supabase/crudMarca";

export interface MarcaStore {
  // ===== ESTADO =====
  datamarca: Marca[];
  marcaItemSelect: Marca | null;
  parametros: number | null;

  // ===== ACCIONES =====
  mostrarMarca: (id_empresa: number) => Promise<Marca[]>;
  insertarMarca: (p: any) => Promise<boolean>;
  eliminarproductos: (Id: number) => Promise<void>;
  editarMarca: (p: Marca) => Promise<boolean>;
}

export const useMarcaStore = create<MarcaStore>((set, get) => ({
  // ===== ESTADO INICIAL =====
  datamarca: [],
  marcaItemSelect: null,
  parametros: null,

  // ===== ACCIONES =====
  mostrarMarca: async (id_empresa: number) => {
    const response = await MostrarMarca(id_empresa);
    set({
      parametros: id_empresa,
      datamarca: response ?? [],
      marcaItemSelect: response && response.length > 0 ? response[0] : null,
    });

    return response ?? [];
  },
  insertarMarca: async (p) => {
    const res = await InsertarMarca(p);
    if (!res) {return false}
    const { parametros, mostrarMarca } = get();
    if (parametros) {
      await mostrarMarca(parametros); 
    }
    return true;
  },
  eliminarproductos: async (Id: number) => {
    await EliminarMarca(Id)
    const { parametros, mostrarMarca } = get();

    if (parametros) {
      await mostrarMarca(parametros); 
    }
  },
  editarMarca: async ( p : Marca ) => {
    const res = await EditarMarca (p)
    if (!res) {return false}
    const { parametros, mostrarMarca } = get();

    if (parametros) {
      await mostrarMarca(parametros); 
    }
    return true;
  }

}));