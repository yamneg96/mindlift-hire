import { useState } from "react"
import { KeyRound, Mail } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdminVerifyOtpMutation } from "@/lib/api/hooks"
import { useAppStore } from "@/store/app-store"
import { useFeedbackModal } from "@/components/feedback-modal-provider"

export function AdminOtpPage({
  onNavigate,
}: {
  onNavigate: (target: "admin-dashboard" | "admin-login" | "landing") => void
}) {
  const { showError, showSuccess } = useFeedbackModal()
  const [otp, setOtp] = useState("")
  const adminOtpEmail = useAppStore((state) => state.adminOtpEmail)
  const verifyOtpMutation = useAdminVerifyOtpMutation()

  const submitVerifyOtp = async () => {
    if (!adminOtpEmail || otp.length !== 6) {
      showError({
        title: "Invalid OTP",
        description: "Enter the 6-digit code sent to your email.",
      })
      return
    }

    try {
      await verifyOtpMutation.mutateAsync({ email: adminOtpEmail, otp })
      showSuccess({
        title: "Login Verified",
        description: "OTP verified successfully. Redirecting to dashboard.",
      })
      onNavigate("admin-dashboard")
    } catch (error) {
      showError({
        title: "Verification Failed",
        description: (error as Error).message,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md overflow-hidden border border-border py-0">
          <div className="relative border-b border-border bg-primary/10 p-6">
            <div className="absolute right-4 bottom-2 text-primary/20">
              <KeyRound className="size-16" />
            </div>
            <BrandLogo
              subtitle="Admin OTP Verification"
              onClick={() => onNavigate("landing")}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email.
            </p>
          </div>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="size-4" />
                Email
              </Label>
              <Input disabled value={adminOtpEmail ?? "No email found"} />
            </div>
            <div className="space-y-2">
              <Label>One-Time Password</Label>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <Button
              className="w-full"
              disabled={verifyOtpMutation.isPending || !adminOtpEmail}
              onClick={submitVerifyOtp}
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => onNavigate("admin-login")}
            >
              Back to Admin Login
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
