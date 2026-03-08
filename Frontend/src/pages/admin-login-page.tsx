import type { ReactNode } from "react"
import { Eye, Lock, Mail } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLoginPage({
  onNavigate,
}: {
  onNavigate: (target: "admin-dashboard" | "landing") => void
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md overflow-hidden border border-border py-0">
          <div className="relative border-b border-border bg-primary/10 p-6">
            <div className="absolute right-4 bottom-2 text-primary/20">
              <Lock className="size-16" />
            </div>
            <BrandLogo subtitle="Role Portal" />
            <p className="mt-4 text-sm text-muted-foreground">
              Please sign in to your admin account.
            </p>
          </div>
          <CardContent className="space-y-4 p-6">
            <Field
              icon={<Mail className="size-4" />}
              label="Email"
              placeholder="admin@mindlift.com"
              type="email"
            />
            <Field
              icon={<Lock className="size-4" />}
              label="Password"
              placeholder="********"
              rightIcon={<Eye className="size-4" />}
              type="password"
            />
            <Button
              className="w-full"
              onClick={() => onNavigate("admin-dashboard")}
            >
              Sign In to Portal
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => onNavigate("landing")}
            >
              Back to Public Site
            </Button>
            <p className="pt-2 text-center text-xs tracking-wider text-muted-foreground uppercase">
              Internal corporate access only
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function Field({
  icon,
  rightIcon,
  label,
  placeholder,
  type,
}: {
  icon: ReactNode
  rightIcon?: ReactNode
  label: string
  placeholder: string
  type: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute top-2.5 left-2 text-muted-foreground">
          {icon}
        </span>
        <Input className="h-9 pl-8" placeholder={placeholder} type={type} />
        {rightIcon ? (
          <span className="absolute top-2.5 right-2 text-muted-foreground">
            {rightIcon}
          </span>
        ) : null}
      </div>
    </div>
  )
}
