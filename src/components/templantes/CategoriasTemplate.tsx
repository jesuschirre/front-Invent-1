import { useEffect, useState } from "react";
import { useCategoriasStore } from "../../store/CategoriasStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import type { InterfaceCatego } from "../../supabase/crudCategorias";
import DataTable, { type TableColumn } from "react-data-table-component";
import { GoPencil } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { GrAdd, GrSearch } from "react-icons/gr";
import CirImg from "../moleculas/CirImg";
import ModalInsertCategoria from "../organismos/form/ModalInsertCategoria";
import EditarCategoriaModal from "../organismos/form/EditarCategoriaModal";

export default function CategoriasTemplate() {
    const {datacategorias,mostrarcategorias,deletecategoria} = useCategoriasStore();
    const {dataempresa} = useEmpresaStore();
    const [openModalCate, setOpenModalCate] = useState(false);
    const [openModalCateEdit, setOpenModalCateEdit] = useState(false);
    const [cateSeleccionada, setCateSelect] = useState<InterfaceCatego | null>(null);
    const { theme } = useTheme();
    
    const dark = theme === "dark";
    useEffect(() => {
        if (!dataempresa?.empresa?.id) return;
        mostrarcategorias(dataempresa.empresa.id);
    }, [mostrarcategorias, dataempresa]);

    // Columnas con mejor diseño y botones de acción
    const columns: TableColumn<InterfaceCatego>[] = [
      {
        name: "NOMBRE DE CATEGORIA",
        selector: (row: InterfaceCatego) => row.nombre,
        sortable: true,
        cell: (row: InterfaceCatego) => (
          <div className="font-bold text-slate-700 dark:text-white">{row.nombre}</div>
        ),
      },
      {
        name: "DESCRIPCION DE CATEGORIA",
        selector: (row: InterfaceCatego) => row.descripcion,
        sortable: true,
        cell: (row: InterfaceCatego) => (
          <div className="font-bold text-slate-700 dark:text-white">{row.descripcion}</div>
        ),
      },
      {
        name: "ID DE EMPRESA",
        selector: (row: InterfaceCatego) => row.id_empresa,
        sortable: true,
        cell: (row: InterfaceCatego) => (
          <div className="font-bold text-slate-700 dark:text-white">{row.id_empresa}</div>
        ),
      },
      {
        name: "COLOR CATEGORIA",
        selector: (row: InterfaceCatego) => row.color,
        sortable: true,
        cell: (row: InterfaceCatego) => (
          <div className="font-bold text-slate-700 dark:text-white">{row.color}</div>
        ),
      },
      {
        name: "ACCIONES",
        cell: (row: InterfaceCatego) => (
          <div className="flex gap-2">
            <button onClick={() => {
              setCateSelect(row);
              setOpenModalCateEdit(true);
            }}  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <GoPencil size={18} />  
            </button>
            <button onClick={() => deletecategoria(row.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <FaRegTrashAlt size={18} />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        button: true,
        width: "120px",
      },
    ];

    // Estilos personalizados para DataTable
  const customStyles = {
    table: {
      style: {
        backgroundColor: dark ? "#1f2937" : "#ffffff",
        color: dark ? "#e5e7eb" : "#1f2937",
      },
    },

    header: {
      style: {
        display: "none",
      },
    },

    headRow: {
      style: {
        backgroundColor: dark ? "#111827" : "#f8fafc",
        borderBottomColor: dark ? "#374151" : "#e2e8f0",
      },
    },

    headCells: {
      style: {
        color: dark ? "#d1d5db" : "#64748b",
        fontWeight: "700",
        fontSize: "12px",
      },
    },

    rows: {
      style: {
        backgroundColor: dark ? "#1f2937" : "#ffffff",
        color: dark ? "#e5e7eb" : "#1f2937",
        fontSize: "14px",

        "&:not(:last-child)": {
          borderBottomColor: dark ? "#374151" : "#f1f5f9",
        },

        "&:hover": {
          backgroundColor: dark ? "#374151" : "#f1f5f9",
          transition: "0.2s",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: dark ? "#111827" : "#ffffff",
        color: dark ? "#e5e7eb" : "#1f2937",
      },
    },
  };

  return (
    <div className="min-h-screen p-4 md:p-8"> 
      <div className="max-w-6xl mx-auto flex flex-col h-full gap-6">
        {/* TOP BAR / LOGO */}
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-600 dark:border-0">
          <CirImg />
        </header> 
        
                  {/* HEADER DE PÁGINA: Título + Botón */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight dark:text-white">Categorias</h1>
            <p className="text-slate-500 dark:text-slate-300">Gestiona el catálogo de categorias para tu empresa</p>
          </div>
          
          <button
            onClick={() => setOpenModalCate(true)}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg  transition-all active:scale-95 group"
          >
            <GrAdd className="group-hover:rotate-90 transition-transform" />
            <span>Nueva Categoria</span>
          </button>
        </div>
                {/* BUSCADOR Y TABLA */}
        <section className="bg-white dark:bg-black rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:rounded-xl dark:border-slate-500">
          {/* Barra de búsqueda interna */}
          <div className="p-4 border-b  bg-slate-50/50 flex items-center gap-3 dark:bg-slate-600 ">

            <GrSearch className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar marca..." 
              className="bg-transparent outline-none text-sm w-full text-slate-600 dark:text-white"
            />
          </div>

          <DataTable 
 
            columns={columns} 
            data={datacategorias} 
            customStyles={customStyles}
            pagination
            paginationComponentOptions={{
                rowsPerPageText: 'Filas por página:',
                rangeSeparatorText: 'de',
                noRowsPerPage: false,
                selectAllRowsItem: false
            }}
            noDataComponent={
                <div className="p-10 text-slate-400">No se encontraron marcas registradas.</div>
            }
          />
        </section>
        {openModalCate && <ModalInsertCategoria onClose={() => setOpenModalCate(false)} />}
        {openModalCateEdit && cateSeleccionada && (
          <EditarCategoriaModal
            categoria={cateSeleccionada}
            onClose={() => {
              setOpenModalCateEdit(false);
              setCateSelect(null);
            }}
          />
        )}
       </div>     
    </div>
  )
}
