import { useState, type ReactNode } from "react"
import { Lock, Mail } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdminLoginOtpMutation } from "@/lib/api/hooks"
import { useAppStore } from "@/store/app-store"

export function AdminLoginPage({
  onNavigate,
}: {
  onNavigate: (target: "admin-verify-otp" | "landing") => void
}) {
  const [email, setEmail] = useState("admin@mindlift.com")
  const setAdminOtpEmail = useAppStore((state) => state.setAdminOtpEmail)
  const loginOtpMutation = useAdminLoginOtpMutation()

  const submitLoginOtp = async () => {
    try {
      await loginOtpMutation.mutateAsync({ email })
      setAdminOtpEmail(email)
      onNavigate("admin-verify-otp")
    } catch {
      // no-op; message shown below
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md overflow-hidden border border-border py-0">
          <div className="relative border-b border-border bg-primary/10 p-6">
            <div className="absolute right-4 bottom-2 text-primary/20">
              <Lock className="size-16" />
            </div>
            <BrandLogo
              subtitle="Role Portal"
              onClick={() => onNavigate("landing")}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Enter your authorized admin email and we will send a one-time
              verification code.
            </p>
          </div>
          <CardContent className="space-y-4 p-6">
            <Field
              icon={<Mail className="size-4" />}
              label="Email"
              placeholder="admin@mindlift.com"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <Button
              className="w-full"
              disabled={loginOtpMutation.isPending}
              onClick={submitLoginOtp}
            >
              {loginOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
            {loginOtpMutation.isError ? (
              <p className="text-sm text-destructive">
                {(loginOtpMutation.error as Error).message}
              </p>
            ) : null}
            {loginOtpMutation.isSuccess ? (
              <p className="text-sm text-primary">
                OTP sent. Continue to verification.
              </p>
            ) : null}
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
  value,
  onChange,
}: {
  icon: ReactNode
  rightIcon?: ReactNode
  label: string
  placeholder: string
  type: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute top-2.5 left-2 text-muted-foreground">
          {icon}
        </span>
        <Input
          className="h-9 pl-8"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {rightIcon ? (
          <span className="absolute top-2.5 right-2 text-muted-foreground">
            {rightIcon}
          </span>
        ) : null}
      </div>
    </div>
  )
}
