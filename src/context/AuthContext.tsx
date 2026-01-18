import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../index.ts"
import { type User } from "@supabase/supabase-js";
// 1. Definir el tipo del contexto
interface AuthContextType {
  user: User | null;
}

// 2. Crear el contexto con valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tipar las props del Provider
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    // Limpieza correcta del listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook personalizado con validación
export const UserAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }

  return context;
};
