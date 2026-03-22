import type { Applicant } from "@/lib/mock-data"

export type RoleSuggestionResult = {
  auto: Array<{ role: string; applicant: Applicant }>
  conflict: Array<{ role: string; applicants: Applicant[] }>
  nextRound: Applicant[]
}

/**
 * Groups applicants by their first unassigned role choice and classifies roles into AUTO and CONFLICT.
 * @param applicants Remaining applicants to assign
 * @param assignedRoles Record<role, applicantId>
 */
export function generateRoleSuggestions(
  applicants: Applicant[],
  assignedRoles: Record<string, string>
): RoleSuggestionResult {
  // Filter out applicants who have no remaining choices or are already assigned
  const unassignedApplicants = applicants.filter(
    (a) =>
      !a.roleChoices.every((role) => assignedRoles[role]) &&
      a.roleChoices.length > 0
  )

  // Group applicants by their first available (unassigned) role choice
  const roleGroups: Record<string, Applicant[]> = {}
  for (const applicant of unassignedApplicants) {
    const firstAvailable = applicant.roleChoices.find(
      (role) => !assignedRoles[role]
    )
    if (!firstAvailable) continue
    if (!roleGroups[firstAvailable]) roleGroups[firstAvailable] = []
    roleGroups[firstAvailable].push(applicant)
  }

  const auto: Array<{ role: string; applicant: Applicant }> = []
  const conflict: Array<{ role: string; applicants: Applicant[] }> = []

  for (const [role, group] of Object.entries(roleGroups)) {
    if (group.length === 1) {
      auto.push({ role, applicant: group[0] })
    } else if (group.length > 1) {
      conflict.push({ role, applicants: group })
    }
  }

  // For next round, remove assigned applicants and shift roleChoices for those not selected
  // This is handled by the engine, not here, but we return the remaining applicants for next round
  const nextRound = unassignedApplicants.filter((a) => {
    // If applicant's all choices are assigned, they are not in next round
    return a.roleChoices.some((role) => !assignedRoles[role])
  })

  return { auto, conflict, nextRound }
}
