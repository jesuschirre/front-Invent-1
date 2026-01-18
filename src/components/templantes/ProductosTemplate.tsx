import  { useEffect, useState } from "react";
import CirImg from "../moleculas/CirImg";
import { useEmpresaStore } from "../../store/EmpresaStore";
import DataTable, { type TableColumn } from "react-data-table-component";
import { GrAdd, GrSearch } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useProductosStore } from "../../store/ProductosStore";
import { type InsertarProductoDTO } from "../../supabase/crudProductos";
import ModalInsertProducto from "../organismos/form/ModalInsertProducto";
import EditarProductModal from "../organismos/form/EditarProductModal";
export default function ProductosTemplate() {
  const { eliminarproductos, mostrarproductos, dataproductos } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [openModalEditProduct, setOpenModalEditProduct] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [productSeleccionada, setProductSeleccionada] = useState<InsertarProductoDTO | null>(null);
  const { theme } = useTheme();

  const dark = theme === "dark";

  useEffect(() => {
    if (!dataempresa?.empresa?.id) return;
    mostrarproductos(dataempresa.empresa.id);
  }, [mostrarproductos, dataempresa]);

  // Columnas con mejor diseño y botones de acción
const columns: TableColumn<InsertarProductoDTO>[] = [
  {
    name: "PRODUCTO",
    selector: row => row.descripcion,
    sortable: true,
    cell: row => (
      <div className="font-bold text-slate-700 dark:text-white">
        {row.descripcion}
      </div>
    ),
  },
  {
    name: "CÓD. BARRAS",
    selector: row => row.codigobarras,
    sortable: true,
  },
  {
    name: "CÓD. INTERNO",
    selector: row => row.codigointerno,
    sortable: true,
  },
  {
    name: "MARCA",
    selector: row => row.idmarca,
    sortable: true,
    width: "90px",
  },
  {
    name: "CATEGORÍA",
    selector: row => row.id_categoria,
    sortable: true,
    width: "110px",
  },
  {
    name: "STOCK",
    selector: row => row.stock,
    sortable: true,
    width: "90px",
  },
  {
    name: "STOCK MÍN.",
    selector: row => row.stock_minimo,
    sortable: true,
    width: "110px",
  },
  {
    name: "P. COMPRA",
    selector: row => row.preciocompra,
    sortable: true,
    cell: row => (
      <span className="text-green-600 font-semibold">
        S/ {row.preciocompra}
      </span>
    ),
  },
  {
    name: "P. VENTA",
    selector: row => row.precioventa,
    sortable: true,
    cell: row => (
      <span className="text-blue-600 font-semibold">
        S/ {row.precioventa}
      </span>
    ),
  },
  {
    name: "EMPRESA",
    selector: row => row.id_empresa,
    sortable: true,
    width: "100px",
  },
  {
    name: "ACCIONES",
    cell: row => (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setProductSeleccionada(row);
            setOpenModalEditProduct(true);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <GoPencil size={18} />
        </button>

        <button
          onClick={() => eliminarproductos(row.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaRegTrashAlt size={18} />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    button: true,
    width: "130px",
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
      <div className="max-w-7xl mx-auto flex flex-col h-full gap-6">
        
        {/* TOP BAR / LOGO */}
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-600 dark:border-0">
          <CirImg />
        </header>

        {/* HEADER DE PÁGINA: Título + Botón */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight dark:text-white">Productos</h1>
            <p className="text-slate-500 dark:text-slate-300">Gestiona el catálogo de productos para tu empresa</p>
          </div>
          
          <button
            onClick={() => setOpenModalProduct(true)}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg  transition-all active:scale-95 group"
          >
            <GrAdd className="group-hover:rotate-90 transition-transform" />
            <span>Nuevo Producto</span>
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
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          
          <DataTable 
            columns={columns} 
            data={dataproductos} 
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

        {openModalProduct && <ModalInsertProducto onClose={() => setOpenModalProduct(false)} />}
        {openModalEditProduct && productSeleccionada && (
          <EditarProductModal
            producto={productSeleccionada}
            onClose={() => {
              setOpenModalEditProduct(false);
              setProductSeleccionada(null);
            }}
          />
        )}
      </div>
    </div>
  )
}
