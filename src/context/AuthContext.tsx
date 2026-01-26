import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../supabase/supabase.config";
import { type User } from "@supabase/supabase-js";
import { ObtenerIdUsuarioArg } from "../supabase/GlobalSupabase";
import { modulosUsu } from "../store/ModulosPermisos";
import { type EmpresaAsignada } from "../supabase/crudEmpresa";
import { MostrarEmpresa } from "../supabase/crudEmpresa";
// 1. Definir el tipo del contexto

interface Modulo {
  id: number;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  modulos: Modulo[]; // 1. Agregamos modulos a la interfaz
  empresa: EmpresaAsignada | null;
}

// 2. Crear el contexto con valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tipar las props del Provider
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]); // 2. Estado para módulos
  const [empresa, setEmpresa] = useState<EmpresaAsignada | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Carga inicial de sesión
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    getSession();

    // 2. Listener de cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setUser(session?.user ?? null);
        }

        // CASO CRÍTICO: Si el token expira o el usuario cierra sesión
        if (event === "SIGNED_OUT" || (event === "USER_UPDATED" && !session)) {
          setUser(null);
          setModulos([]);
          setLoading(false);
        }
        
        // Si el refresh del token falla (token expirado y no renovable)
        if (!session && event !== "INITIAL_SESSION") {
           setUser(null);
           setModulos([]);
           setLoading(false);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // 3. Lógica centralizada de Usuario + Módulos
  useEffect(() => {
    const cargarDatosCompletos = async () => {
      if (user) {
        setLoading(true); // Iniciamos carga de datos internos
        try {
          const idusu = await ObtenerIdUsuarioArg(user.id);
          if (idusu) {
            const empresaUsu = await MostrarEmpresa(Number(idusu))
            const dataModulos = await modulosUsu(Number(idusu));
            setModulos(dataModulos);
            setEmpresa(empresaUsu);
          } else {
            setModulos([]);
            setEmpresa(null)
          }
        } catch (error) {
          console.error("Error cargando permisos:", error);
        } finally {
          setLoading(false); // Aquí se detiene el loading finalmente
        }
      }
    };

    cargarDatosCompletos();
  }, [user]);

  return (
    //  Enviamos modulos en el value
    <AuthContext.Provider value={{ user, loading, modulos, empresa }}>
      {children}
    </AuthContext.Provider>
  );
};
// Hook personalizado con validación
export const UserAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("UserAuth must be used within AuthContextProvider");
  }

  return context;
};