export const appRoutes = [
  "landing",
  "about",
  "application-form",
  "minimal-application",
  "contact",
  "privacy",
  "terms",
  "admin-login",
  "admin-dashboard",
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
  "admin-dashboard": "AdminDashboardPage",
  "applicant-list": "ApplicantListPage",
  "applicant-details": "ApplicantDetailsPage",
}
