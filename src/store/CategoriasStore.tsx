import { create } from "zustand";
import { EditarCategorias, EliminarCategorias, InsertarCategorias, MostrarCategorias } from "../supabase/crudCategorias";
import type {InterfaceCatego} from "../supabase/crudCategorias"

interface CategoriaStore {
  // ===== ESTADO =====
  datacategorias: InterfaceCatego[];
  categoriasItemSelect: InterfaceCatego |null
  parametros: number | null;
  // ===== ACCIONES =====
  mostrarcategorias: (IdEmpresa: number) => Promise<InterfaceCatego[]>;
  insertarcategorias: (p: any) => Promise<void>;
  deletecategoria: (id:number) => Promise<void>
  editarcategoria: (p:InterfaceCatego ) => Promise<void>;
}

export const useCategoriasStore = create<CategoriaStore>((set, get) => ({
  datacategorias: [],
  categoriasItemSelect: null,
  parametros: null,

  mostrarcategorias: async (IdEmpresa: number) => {
    const response = await MostrarCategorias(IdEmpresa);
    set({
      parametros: IdEmpresa,
      datacategorias: response ?? [],
      categoriasItemSelect: response && response.length > 0 ? response[0] : null,
    });
    return response ?? [];
  },

  insertarcategorias: async (p) => {
    await InsertarCategorias(p);
    const { parametros, mostrarcategorias } = get();

    if (parametros) {
      await mostrarcategorias(parametros); 
    }
  },

  deletecategoria: async (id:number) => {
    await EliminarCategorias(id);
    const { parametros, mostrarcategorias } = get();

    if (parametros) {
      await mostrarcategorias(parametros);
    }
  },

  editarcategoria: async (p: InterfaceCatego) => {
    await EditarCategorias(p);
        const { parametros, mostrarcategorias } = get();

    if (parametros) {
      await mostrarcategorias(parametros);
    }
  },



}));