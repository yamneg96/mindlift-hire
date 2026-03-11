import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ModalKind = "success" | "error" | "confirm"

type ModalState = {
  open: boolean
  kind: ModalKind
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

type ModalOptions = {
  title: string
  description?: string
}

type ConfirmOptions = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

type FeedbackModalContextValue = {
  showSuccess: (options: ModalOptions) => void
  showError: (options: ModalOptions) => void
  confirmDelete: (options: ConfirmOptions) => Promise<boolean>
}

const FeedbackModalContext = createContext<FeedbackModalContextValue | null>(
  null
)

const defaultState: ModalState = {
  open: false,
  kind: "success",
  title: "",
}

export function FeedbackModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(defaultState)
  const confirmResolver = useRef<((value: boolean) => void) | null>(null)

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }))
  }, [])

  const showSuccess = useCallback((options: ModalOptions) => {
    setModal({
      open: true,
      kind: "success",
      title: options.title,
      description: options.description,
      confirmLabel: "Great",
    })
  }, [])

  const showError = useCallback((options: ModalOptions) => {
    setModal({
      open: true,
      kind: "error",
      title: options.title,
      description: options.description,
      confirmLabel: "OK",
    })
  }, [])

  const confirmDelete = useCallback((options: ConfirmOptions) => {
    setModal({
      open: true,
      kind: "confirm",
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel ?? "Delete",
      cancelLabel: options.cancelLabel ?? "Cancel",
    })

    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve
    })
  }, [])

  const resolveConfirm = useCallback(
    (value: boolean) => {
      confirmResolver.current?.(value)
      confirmResolver.current = null
      closeModal()
    },
    [closeModal]
  )

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setModal((prev) => ({ ...prev, open: true }))
        return
      }

      if (modal.kind === "confirm") {
        resolveConfirm(false)
        return
      }

      closeModal()
    },
    [closeModal, modal.kind, resolveConfirm]
  )

  const value = useMemo(
    () => ({ showSuccess, showError, confirmDelete }),
    [showSuccess, showError, confirmDelete]
  )

  const isConfirm = modal.kind === "confirm"

  return (
    <FeedbackModalContext.Provider value={value}>
      {children}
      <Dialog open={modal.open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={!isConfirm}>
          <DialogHeader>
            <div className="mb-2 inline-flex size-10 items-center justify-center rounded-full border border-border bg-muted/60">
              {modal.kind === "success" ? (
                <CheckCircle2 className="size-5 text-primary" />
              ) : modal.kind === "error" ? (
                <AlertTriangle className="size-5 text-destructive" />
              ) : (
                <Trash2 className="size-5 text-destructive" />
              )}
            </div>
            <DialogTitle>{modal.title}</DialogTitle>
            {modal.description ? (
              <DialogDescription>{modal.description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter>
            {isConfirm ? (
              <>
                <Button variant="outline" onClick={() => resolveConfirm(false)}>
                  {modal.cancelLabel ?? "Cancel"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => resolveConfirm(true)}
                >
                  {modal.confirmLabel ?? "Delete"}
                </Button>
              </>
            ) : (
              <Button onClick={closeModal}>{modal.confirmLabel ?? "OK"}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FeedbackModalContext.Provider>
  )
}

export function useFeedbackModal() {
  const context = useContext(FeedbackModalContext)
  if (!context) {
    throw new Error(
      "useFeedbackModal must be used within FeedbackModalProvider"
    )
  }

  return context
}
