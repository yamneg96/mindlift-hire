import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  subtitle?: string
  onClick?: () => void
}

export function BrandLogo({ className, subtitle, onClick }: BrandLogoProps) {
  const Wrapper = onClick ? "button" : "div"

  return (
    <Wrapper
      className={cn(
        "flex items-center gap-3",
        onClick ? "cursor-pointer text-left" : "",
        className
      )}
      onClick={onClick}
      {...(onClick ? { type: "button" as const } : {})}
    >
      <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
        <img
          alt="MindLift logo"
          className="size-full object-cover dark:hidden"
          src="/MindLift-Logo.jpg"
        />
        <img
          alt="MindLift logo"
          className="hidden size-full object-cover dark:block"
          src="/MindLift-Light.jpg"
        />
      </div>
      <div>
        <p className="text-lg font-bold tracking-tight">MindLift</p>
        {subtitle ? (
          <p className="text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </Wrapper>
  )
}
