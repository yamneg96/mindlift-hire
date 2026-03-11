function envToBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) {
    return fallback
  }
  const normalized = value.trim().toLowerCase()
  return normalized === "true" || normalized === "1" || normalized === "yes"
}

export const ROLE_APPLICATIONS_ENABLED = envToBoolean(
  import.meta.env.VITE_ROLE_APPLICATIONS_ENABLED as string | undefined,
  true
)
