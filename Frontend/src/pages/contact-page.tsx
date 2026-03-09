import type { ReactNode } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

export function ContactPage({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Get in touch
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Whether you are looking for support, want to volunteer, or have
            questions about our programs, we are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="border border-border py-0">
            <CardHeader className="border-b border-border py-4">
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Full Name" placeholder="John Doe" />
                <Field
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
              <Field label="Subject" placeholder="How can we help?" />
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea className="min-h-32" placeholder="Your message" />
              </div>
              <Button>Send Message</Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Info title="Visit our office" icon={<MapPin className="size-4" />}>
              Addis Ababa, Ethiopia
            </Info>
            <Info title="Email us" icon={<Mail className="size-4" />}>
              mindliftethiopia@gmail.com
            </Info>
            <Info title="Call us" icon={<Phone className="size-4" />}>
              +251923929113
            </Info>
            <Card className="border border-border bg-muted py-0">
              <CardContent className="flex h-48 items-center justify-center p-4 text-sm text-muted-foreground">
                Map Preview - San Francisco HQ
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

function Info({
  title,
  children,
  icon,
}: {
  title: string
  children: ReactNode
  icon: ReactNode
}) {
  return (
    <Card className="border border-border py-0">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{children}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input className="h-10" placeholder={placeholder} type={type} />
    </div>
  )
}
