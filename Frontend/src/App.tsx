import { useEffect, useMemo, useState } from "react"

import { type AppRoute, appRoutes } from "@/lib/routes"
import { LandingPage } from "@/pages/landing-page"
import { ApplicationFormPage } from "@/pages/application-form-page"
import { MinimalApplicationPage } from "@/pages/minimal-application-page"
import { ContactPage } from "@/pages/contact-page"
import { PrivacyPolicyPage } from "@/pages/privacy-policy-page"
import { TermsOfServicePage } from "@/pages/terms-of-service-page"
import { AdminLoginPage } from "@/pages/admin-login-page"
import { AdminDashboardPage } from "@/pages/admin-dashboard-page"
import { ApplicantListPage } from "@/pages/applicant-list-page"
import { ApplicantDetailsPage } from "@/pages/applicant-details-page"

const defaultRoute: AppRoute = "landing"

function routeFromHash(hash: string): AppRoute {
  const value = hash.replace("#", "") as AppRoute
  return appRoutes.includes(value) ? value : defaultRoute
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    routeFromHash(window.location.hash)
  )

  const goTo = (target: AppRoute) => {
    setRoute(target)
    window.location.hash = target
  }

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash(window.location.hash))
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const content = useMemo(() => {
    switch (route) {
      case "landing":
        return <LandingPage onNavigate={(target) => goTo(target as AppRoute)} />
      case "application-form":
        return (
          <ApplicationFormPage
            onNavigate={(target) => goTo(target as AppRoute)}
          />
        )
      case "minimal-application":
        return (
          <MinimalApplicationPage
            onNavigate={(target) => goTo(target as AppRoute)}
          />
        )
      case "contact":
        return <ContactPage onNavigate={(target) => goTo(target as AppRoute)} />
      case "privacy":
        return (
          <PrivacyPolicyPage
            onNavigate={(target) => goTo(target as AppRoute)}
          />
        )
      case "terms":
        return (
          <TermsOfServicePage
            onNavigate={(target) => goTo(target as AppRoute)}
          />
        )
      case "admin-login":
        return (
          <AdminLoginPage
            onNavigate={(target) =>
              goTo(target === "admin-dashboard" ? "admin-dashboard" : "landing")
            }
          />
        )
      case "admin-dashboard":
        return <AdminDashboardPage onNavigate={goTo} />
      case "applicant-list":
        return <ApplicantListPage onNavigate={goTo} />
      case "applicant-details":
        return <ApplicantDetailsPage onNavigate={goTo} />
      default:
        return <LandingPage onNavigate={(target) => goTo(target as AppRoute)} />
    }
  }, [route])

  return <>{content}</>
}

export default App
