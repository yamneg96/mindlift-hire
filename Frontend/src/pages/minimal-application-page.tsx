import { PublicLayout } from "@/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Navigate = (
  target:
    | "application-form"
    | "minimal-application"
    | "contact"
    | "privacy"
    | "terms"
    | "admin-login"
    | "landing"
) => void

export function MinimalApplicationPage({
  onNavigate,
}: {
  onNavigate: Navigate
}) {
  return (
    <PublicLayout onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="text-4xl font-black tracking-tight">Join MindLift</h1>
        <p className="mt-2 text-muted-foreground">
          Fast track application for high-intent candidates.
        </p>

        <Card className="mt-6 border border-border py-0">
          <CardHeader className="border-b border-border py-4">
            <CardTitle>Minimal Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input className="h-10" placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                className="h-10"
                placeholder="jane@example.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label>Role Selection</Label>
              <Input className="h-10" placeholder="Project Coordinator" />
            </div>
            <div className="space-y-2">
              <Label>CV Upload</Label>
              <Input className="h-10" type="file" />
            </div>
            <div className="space-y-2">
              <Label>Motivation Letter</Label>
              <Textarea
                className="min-h-28"
                placeholder="Tell us why you want to join MindLift."
              />
            </div>
            <Button className="w-full">Submit Application</Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
