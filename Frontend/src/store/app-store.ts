import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

type AppState = {
  token: string | null
  user: AuthUser | null
  adminOtpEmail: string | null
  selectedApplicationId: string | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
  setAdminOtpEmail: (email: string | null) => void
  setSelectedApplicationId: (id: string | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      adminOtpEmail: null,
      selectedApplicationId: null,
      setAuth: (token, user) => set({ token, user }),
      setAdminOtpEmail: (email) => set({ adminOtpEmail: email }),
      clearAuth: () =>
        set({
          token: null,
          user: null,
          adminOtpEmail: null,
          selectedApplicationId: null,
        }),
      setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
    }),
    {
      name: "mindlift-app-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        adminOtpEmail: state.adminOtpEmail,
        selectedApplicationId: state.selectedApplicationId,
      }),
    }
  )
)
