import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { type AppRoute, appRoutes } from "@/lib/routes"
import { LandingPage } from "@/pages/landing-page"
import { AboutPage } from "@/pages/about-page"
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

const routeMeta: Record<AppRoute, { title: string; description: string }> = {
  landing: {
    title: "MindLift Role Portal | Apply and Manage Talent",
    description:
      "Discover open MindLift roles, submit applications, and track opportunities in one streamlined portal.",
  },
  about: {
    title: "About MindLift | Mission, Values, and Leadership",
    description:
      "Learn MindLift's story, mission, values, and leadership team working to improve mental health support for all.",
  },
  "application-form": {
    title: "Application Form | MindLift Role Portal",
    description:
      "Complete your multi-step MindLift role application with profile details, documents, and links.",
  },
  "minimal-application": {
    title: "Quick Apply | MindLift Role Portal",
    description:
      "Submit a minimal application quickly for open MindLift positions.",
  },
  contact: {
    title: "Contact MindLift | Role Portal",
    description:
      "Get in touch with MindLift for support, partnership, or role-related questions.",
  },
  privacy: {
    title: "Privacy Policy | MindLift Role Portal",
    description:
      "Read how MindLift collects, uses, and protects application and profile data.",
  },
  terms: {
    title: "Terms of Service | MindLift Role Portal",
    description:
      "Review usage terms, eligibility, and platform responsibilities for MindLift Role Portal.",
  },
  "admin-login": {
    title: "Admin Login | MindLift Role Portal",
    description:
      "Secure sign-in for MindLift administrators to manage applicants and recruitment workflows.",
  },
  "admin-dashboard": {
    title: "Admin Dashboard | MindLift Role Portal",
    description:
      "Monitor application metrics, activity, and candidate progress from the MindLift admin dashboard.",
  },
  "applicant-list": {
    title: "Applicants | MindLift Role Portal",
    description:
      "Search, filter, sort, and export applicant pipelines in the MindLift admin console.",
  },
  "applicant-details": {
    title: "Applicant Details | MindLift Role Portal",
    description:
      "Review profile data, documents, motivation letters, and evaluations for each candidate.",
  },
}

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
    if (target === "landing") {
      window.history.pushState({}, "", "/")
      return
    }

    window.location.hash = target
  }

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash(window.location.hash))
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    const meta = routeMeta[route]
    document.title = meta.title

    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute("content", meta.description)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute("content", meta.title)
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    )
    if (ogDescription) {
      ogDescription.setAttribute("content", meta.description)
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute("content", meta.title)
    }

    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    )
    if (twitterDescription) {
      twitterDescription.setAttribute("content", meta.description)
    }
  }, [route])

  const content = useMemo(() => {
    switch (route) {
      case "landing":
        return <LandingPage onNavigate={(target) => goTo(target as AppRoute)} />
      case "about":
        return <AboutPage onNavigate={(target) => goTo(target as AppRoute)} />
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}

export default App
