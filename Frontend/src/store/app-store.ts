import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

import type { Applicant } from "@/lib/mock-data"

type EmailIntent = {
  recipient?: string
  subject?: string
  message?: string
}

type AppState = {
  emailIntent: EmailIntent | null
  setEmailIntent: (intent: EmailIntent | null) => void
  token: string | null
  user: AuthUser | null
  adminOtpEmail: string | null
  selectedApplicationId: string | null
  selectedRoleId: string | null
  // Role Decision Engine state
  selectedAssignments: Record<string, string>
  remainingApplicants: Applicant[]
  assignRole: (role: string, applicantId: string) => void
  resetDecision: () => void
  advanceRound: () => void
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
  setAdminOtpEmail: (email: string | null) => void
  setSelectedApplicationId: (id: string | null) => void
  setSelectedRoleId: (id: string | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      adminOtpEmail: null,
      selectedApplicationId: null,
      selectedRoleId: null,
      // Role Decision Engine state
      emailIntent: null,
      setEmailIntent: (intent) => set({ emailIntent: intent }),
      selectedAssignments: {},
      remainingApplicants: [],
      assignRole: (role, applicantId) => {
        // Remove applicant from pool and assign
        const applicants = get().remainingApplicants
        const newApplicants = applicants.filter((a) => a.id !== applicantId)
        for (const a of newApplicants) {
          if (a.roleChoices[0] === role) {
            a.roleChoices = a.roleChoices.slice(1)
          }
        }
        set({
          selectedAssignments: {
            ...get().selectedAssignments,
            [role]: applicantId,
          },
          remainingApplicants: newApplicants,
        })
      },
      resetDecision: () => {
        set({
          selectedAssignments: {},
          remainingApplicants: [],
        })
      },
      advanceRound: () => {
        // This can be used to trigger next round logic if needed
      },
      setAuth: (token, user) => set({ token, user }),
      setAdminOtpEmail: (email) => set({ adminOtpEmail: email }),
      clearAuth: () =>
        set({
          token: null,
          user: null,
          adminOtpEmail: null,
          selectedApplicationId: null,
          selectedRoleId: null,
          selectedAssignments: {},
          remainingApplicants: [],
        }),
      setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
      setSelectedRoleId: (id) => set({ selectedRoleId: id }),
    }),
    {
      name: "mindlift-app-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        adminOtpEmail: state.adminOtpEmail,
        selectedApplicationId: state.selectedApplicationId,
        selectedRoleId: state.selectedRoleId,
        selectedAssignments: state.selectedAssignments,
        remainingApplicants: state.remainingApplicants,
      }),
    }
  )
)
