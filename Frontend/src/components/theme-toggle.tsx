import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    if (theme === "system") {
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "light" : "dark")
      return
    }

    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" && document.documentElement.classList.contains("dark"))

  return (
    <Button
      aria-label="Toggle theme"
      size="icon"
      type="button"
      variant="outline"
      onClick={handleToggle}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
