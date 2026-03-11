import {
  Globe,
  Heart,
  ShieldCheck,
  ArrowRight,
  HandHeart,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PublicLayout } from "@/layouts/public-layout"

type Navigate = (
  target:
    | "about"
    | "application-form"
    | "minimal-application"
    | "contact"
    | "privacy"
    | "terms"
    | "admin-login"
    | "landing"
) => void

const leaders = [
  {
    name: "Dr. Eyosiyas",
    role: "Executive Director",
    image: "/eyosiyas.png",
  },
  {
    name: "Dr. Eden",
    role: "Clinical Lead",
    image: "/eden.png",
  },
]

export function AboutPage({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <section className="relative overflow-hidden px-4 py-20 md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-primary/8" />
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_2px_2px,var(--color-primary)_1px,transparent_0)] [background-size:40px_40px] text-primary/25" />
        </div>

        <div className="relative mx-auto w-full max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Our Mission
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            Empowering Minds, Lifting Spirits for a Brighter Tomorrow
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-xl">
            MindLift is a non-profit dedicated to providing accessible mental
            health support and fostering a resilient community where no one has
            to struggle alone.
          </p>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border shadow-sm">
              <img
                alt="MindLift team"
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="absolute -right-5 -bottom-5 hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-lg md:block">
              <p className="text-3xl font-black">13+</p>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase opacity-90">
                Years of Impact
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-tight">Our Story</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                Founded in 2010, MindLift began as a small group of volunteers
                passionate about breaking the stigma surrounding mental health.
                We recognized a critical gap in accessible, community-based
                support systems.
              </p>
              <p>
                Over the decade, we have grown into a global network providing
                professional counseling, educational workshops, and crisis
                support to thousands of individuals worldwide.
              </p>
              <p>
                Today, MindLift stands as a beacon of hope, continuing to evolve
                through evidence-based research and compassionate care so mental
                wellness is treated with the same priority as physical health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight">
              Our Core Values
            </h2>
            <p className="mt-3 text-muted-foreground">
              The principles that guide our mission and shape our impact every
              single day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border bg-background py-0">
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Heart className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Compassion First</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  We approach every individual with empathy, understanding, and
                  a judgment-free heart.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-background py-0">
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Inclusive Care</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Mental health support should be accessible to everyone,
                  regardless of background or status.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-background py-0">
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Integrity and Trust</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  We maintain high standards of professional ethics and
                  confidentiality in all our services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight">
              Our Leadership
            </h2>
            <p className="mt-3 text-muted-foreground">
              Meet the dedicated team driving our vision forward.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((leader) => (
              <div key={leader.name} className="text-center">
                <div className="mx-auto mb-5 size-48 overflow-hidden rounded-full border-4 border-primary/25 transition-colors hover:border-primary">
                  <img
                    alt={leader.name}
                    className="h-full w-full object-cover"
                    src={leader.image}
                  />
                </div>
                <h3 className="text-lg font-bold">{leader.name}</h3>
                <p className="text-sm font-semibold text-primary">
                  {leader.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-6">
        <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-primary p-10 text-center text-primary-foreground md:p-14">
          <div className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 size-44 rounded-full bg-primary-foreground/10" />

          <div className="relative">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Ready to make a difference?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base opacity-95 md:text-lg">
              Join us in our mission to provide mental health support for all.
              Whether through volunteering or donating, your support matters.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                className="bg-background text-foreground hover:bg-background/90"
                onClick={() => onNavigate("application-form")}
              >
                Get Involved
                <ArrowRight className="size-4" />
              </Button>
              <Button
                className="border border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => onNavigate("contact")}
              >
                <Mail className="size-4" />
                Contact Support
              </Button>
              <Button
                className="border border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => onNavigate("minimal-application")}
              >
                <HandHeart className="size-4" />
                Donate
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
