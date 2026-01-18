import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Configuracion from "../pages/Configuracion"
import Marca from "../pages/Marca"
import ProtectRoute from "../hooks/ProtectRoute"
import { UserAuth } from "../context/AuthContext"
import Categorias from "../pages/Categorias"
import Productos from "../pages/Productos"


export default function Routers() {
  const {user} = UserAuth();
  return (
      <Routes>
        
        <Route path="/login" element={<Login/>}/>
        
        <Route element={<ProtectRoute user={user} redirectTo="/login"/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/configurar" element={<Configuracion/>}/>
          <Route path="/configurar/marca" element={<Marca />} />
          <Route path="/configurar/categorias" element={<Categorias />}/>
          <Route path="/configurar/productos" element={<Productos />}/>
        </Route>
      </Routes>
  )
}
