import { useState, type ReactNode } from "react"
import { Lock, Mail } from "lucide-react"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"

import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useAdminLoginOtpMutation,
  useGoogleAuthMutation,
} from "@/lib/api/hooks"
import { useAppStore } from "@/store/app-store"

export function AdminLoginPage({
  onNavigate,
}: {
  onNavigate: (
    target: "admin-verify-otp" | "admin-dashboard" | "landing"
  ) => void
}) {
  const [email, setEmail] = useState("admin@mindlift.com")
  const [googleError, setGoogleError] = useState("")
  const setAdminOtpEmail = useAppStore((state) => state.setAdminOtpEmail)
  const loginOtpMutation = useAdminLoginOtpMutation()
  const googleAuthMutation = useGoogleAuthMutation()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined
  const showFallback = !googleClientId || Boolean(googleError)

  const submitLoginOtp = async () => {
    try {
      await loginOtpMutation.mutateAsync({ email })
      setAdminOtpEmail(email)
      onNavigate("admin-verify-otp")
    } catch {
      // no-op; message shown below
    }
  }

  const loginWithGoogle = async (response: CredentialResponse) => {
    if (!response.credential) {
      setGoogleError("Google credential missing. Please try again.")
      return
    }

    setGoogleError("")
    try {
      await googleAuthMutation.mutateAsync({ credential: response.credential })
      onNavigate("admin-dashboard")
    } catch (error) {
      setGoogleError((error as Error).message)
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
              Continue with your authorized Google account. One Tap will prompt
              "Continue as" automatically when available.
            </p>
          </div>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>Google Sign-In (Primary)</Label>
              {googleClientId ? (
                <div className="overflow-hidden rounded-lg border border-border p-3">
                  <GoogleLogin
                    onSuccess={loginWithGoogle}
                    onError={() => setGoogleError("Google sign-in failed")}
                    shape="pill"
                    size="large"
                    text="continue_with"
                    useOneTap
                    width="100%"
                  />
                </div>
              ) : (
                <p className="text-sm text-destructive">
                  Missing VITE_GOOGLE_CLIENT_ID. Configure it to enable One Tap.
                </p>
              )}
            </div>
            {googleAuthMutation.isPending ? (
              <p className="text-sm text-muted-foreground">
                Verifying Google identity...
              </p>
            ) : null}
            {googleError ? (
              <p className="text-sm text-destructive">{googleError}</p>
            ) : null}

            {showFallback ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs tracking-wide text-muted-foreground uppercase">
                    Fallback
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

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
                  {loginOtpMutation.isPending
                    ? "Sending OTP..."
                    : "Send OTP (Fallback)"}
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
              </>
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
