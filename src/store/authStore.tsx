import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

interface LoginParams {
  correo: string;
  pass: string;
}

interface AuthState {
  user: any;
  error: string | null;
  signInWithEmail: (p: LoginParams) => Promise<any>;
  signOut: () => Promise<void>;
}

export const UseAuthStore = create<AuthState>((set) => ({
  user: null,
  error: null,

  signInWithEmail: async (p: LoginParams) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.correo,
      password: p.pass,
    });

    if (error) {
      set({ error: error.message });
      return null;
    }

    set({ user: data.user, error: null });
    return data.user;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error)
      throw new Error(
        "Ha ocurrido un error durante el cierre de sesión: " + error.message
      );

    set({ user: null });
  },
}));