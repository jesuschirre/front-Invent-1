import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Configuracion from "../pages/Configuracion"
import Marca from "../pages/Marca"
import ProtectRoute from "../hooks/ProtectRoute"
import Categorias from "../pages/Categorias"
import Productos from "../pages/Productos"
import Usuario from "../pages/Usuario"
import Kardex from "../pages/kardex"
import Reportes from "../pages/reportes"
import Empresa from "../pages/Empresa"

export default function Routers() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* RUTAS GENERALES (Cualquier usuario logueado) */}
      <Route element={<ProtectRoute redirectTo="/login" />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* RUTA KARDEX */}
      <Route element={<ProtectRoute redirectTo="/login" moduloRequerido="Kardex" />}>
        <Route path="/kardex" element={<Kardex />} />
      </Route>
      {/* RUTA REPORTES */}
      <Route path="/reportes" element={<Reportes />} />

      {/* CONFIGURACIÓN Y ADMINISTRACIÓN */}
      <Route element={<ProtectRoute redirectTo="/login" moduloRequerido="Salidas varias" />}>

        <Route path="/configurar" element={<Configuracion />} />
        <Route element={<ProtectRoute redirectTo="/" moduloRequerido="Marca de productos" />}>
          <Route path="/configurar/marca" element={<Marca />} />
        </Route>
        <Route element={<ProtectRoute redirectTo="/" moduloRequerido="Categoria de productos" />}>
          <Route path="/configurar/categorias" element={<Categorias />} />
        </Route>
        
        <Route element={<ProtectRoute redirectTo="/" moduloRequerido=" Productos" />}>
          <Route path="/configurar/productos" element={<Productos />} />
        </Route>

        <Route element={<ProtectRoute redirectTo="/" moduloRequerido="Personal" />}>
            <Route path="/configurar/usuarios" element={<Usuario />} />
        </Route>

        <Route element={<ProtectRoute redirectTo="/" moduloRequerido="Tu empresa" />}>
            <Route path="/configurar/empresa" element={<Empresa />} />
        </Route>
      </Route>
    </Routes>
  );
}
