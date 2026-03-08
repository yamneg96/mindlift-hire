import { type ReactNode } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title: string
  description: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-card p-8 text-center"
    >
      {icon ? (
        <div className="mx-auto mb-3 flex w-fit rounded-xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  )
}
