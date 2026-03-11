export const appRoutes = [
  "landing",
  "about",
  "application-form",
  "minimal-application",
  "contact",
  "privacy",
  "terms",
  "admin-login",
  "admin-verify-otp",
  "admin-dashboard",
  "admin-roles",
  "admin-settings",
  "admin-email",
  "applicant-list",
  "applicant-details",
] as const

export type AppRoute = (typeof appRoutes)[number]

export const routeLabels: Record<AppRoute, string> = {
  landing: "LandingPage",
  about: "AboutPage",
  "application-form": "ApplicationFormPage",
  "minimal-application": "MinimalApplicationPage",
  contact: "ContactPage",
  privacy: "PrivacyPolicyPage",
  terms: "TermsOfServicePage",
  "admin-login": "AdminLoginPage",
  "admin-verify-otp": "AdminVerifyOtpPage",
  "admin-dashboard": "AdminDashboardPage",
  "admin-roles": "AdminRolesPage",
  "admin-settings": "AdminSettingsPage",
  "admin-email": "AdminEmailPage",
  "applicant-list": "ApplicantListPage",
  "applicant-details": "ApplicantDetailsPage",
}

export const routePaths: Record<AppRoute, string> = {
  landing: "/",
  about: "/about",
  "application-form": "/apply",
  "minimal-application": "/quick-apply",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  "admin-login": "/admin/login",
  "admin-verify-otp": "/admin/verify-otp",
  "admin-dashboard": "/admin/dashboard",
  "admin-roles": "/admin/roles",
  "admin-settings": "/admin/settings",
  "admin-email": "/admin/email",
  "applicant-list": "/admin/applicants",
  "applicant-details": "/admin/applicants/details",
}

const pathToRouteEntries = Object.entries(routePaths).map(([route, path]) => [
  path,
  route as AppRoute,
])

const knownPaths = new Set(pathToRouteEntries.map(([path]) => path))

export function routeFromPath(pathname: string): AppRoute {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/"
  const matched = pathToRouteEntries.find(([path]) => path === normalizedPath)
  return (matched?.[1] ?? "landing") as AppRoute
}

export function pathFromRoute(route: AppRoute): string {
  return routePaths[route] ?? "/"
}

export function isKnownPath(pathname: string): boolean {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/"
  return knownPaths.has(normalizedPath)
}
