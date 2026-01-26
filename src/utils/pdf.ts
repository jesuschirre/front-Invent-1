import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = (
  titulo: string,
  columnas: string[],
  filas: any[][]
) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(titulo, 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [columnas],
    body: filas,
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [8, 145, 178], // cyan
    },
  });

  doc.save(`${titulo}.pdf`);
};

export const exportarMovimientosPDF = (data: any[]) => {
  const columnas = [
    "Fecha",
    "Producto",
    "Tipo",
    "Cantidad",
    "Usuario",
  ];

  const filas = data.map((m) => [
    m.fecha,
    m.id_producto?.descripcion,
    m.tipo,
    m.cantidad,
    m.id_usuario?.nombres,
  ]);

  generarPDF("Reporte de Movimientos", columnas, filas);
};

export const exportarKardexPDF = (data: any[], producto: string) => {
  let saldo = 0;

  const columnas = [
    "Fecha",
    "Tipo",
    "Cantidad",
    "Saldo",
    "Detalle",
  ];

  const filas = data.map((k) => {
    saldo += k.tipo === "entrada"
      ? k.cantidad
      : -k.cantidad;

    return [
      k.fecha,
      k.tipo,
      k.cantidad,
      saldo,
      k.detalles,
    ];
  });

  generarPDF(`Kardex - ${producto}`, columnas, filas);
};
