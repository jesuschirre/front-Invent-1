import { create } from "zustand";
import { ContarUsuariosXempresa, MostrarEmpresa } from "../supabase/crudEmpresa";
import { type EmpresaAsignada } from "../supabase/crudEmpresa";


interface EmpresaStore {
  // ===== ESTADO =====
  dataempresa:  EmpresaAsignada | null ;
  contadorusuarios: number,
  // ===== ACCIONES =====
  mostrarEmpresa: (idUsu: number) => Promise< EmpresaAsignada | null>;
  contarusuariosXempresa: (IdEmpresa: number) => Promise< number>;
}

export const useEmpresaStore = create<EmpresaStore>((set) => ({
  dataempresa: null,
  contadorusuarios: 0,
  mostrarEmpresa: async (idUsu: number) => {
    const empresa = await MostrarEmpresa(idUsu);
    set({ dataempresa: empresa });
    return empresa;
  },  
  contarusuariosXempresa: async (IdEmpresa: number) => {
    const response = await ContarUsuariosXempresa(IdEmpresa)
    set({ contadorusuarios: response });
    return response;
  }

}));

