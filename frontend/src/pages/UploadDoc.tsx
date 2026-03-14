import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Pattern } from "@/components/patterns/p-file-upload-5"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import type { FileWithPreview } from "@/hooks/use-file-upload"
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperNav,
} from "@/components/reui/stepper"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { uploadPDF } from "@/lib/api"

const STEPS = [
  { step: 1, title: "Uploading", desc: "Sending your PDF to the server" },
  { step: 2, title: "Processing", desc: "Extracting and indexing content" },
  { step: 3, title: "Ready", desc: "Your document is ready to chat" },
]

function UploadDoc() {
  const navigate = useNavigate()
  const [step, setStep] = useState<"idle" | "uploading" | "processing" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  // Pattern calls onFilesChange during its render phase.
  // Wrapping in setTimeout(fn, 0) defers the setState calls to after the render
  // cycle completes, preventing the "setState during render" React warning.
  const handleFilesChange = useCallback((files: FileWithPreview[]) => {
    setTimeout(async () => {
      if (files.length === 0) {
        setStep("idle")
        return
      }
      const fileObj = files[0].file instanceof File ? files[0].file : null
      if (!fileObj) {
        setStep("idle")
        return
      }

      setError(null)
      setStep("uploading")

      try {
        await uploadPDF(fileObj)
        setStep("processing")
        setTimeout(() => setStep("done"), 2500)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
        setStep("idle")
      }
    }, 0)
  }, [])

  const stepValue =
    step === "uploading" ? 1 : step === "processing" ? 2 : step === "done" ? 3 : 0

  return (
    <div className="relative min-h-screen bg-[radial-gradient(1200px_circle_at_15%_-20%,rgba(59,130,246,0.16),transparent_48%),radial-gradient(1000px_circle_at_100%_0%,rgba(16,185,129,0.12),transparent_44%),var(--color-background)] p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-1 pb-4 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/Home")}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
        <ModeToggle />
      </div>

      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border/70 bg-card/70 p-6 shadow-[0_10px_38px_rgba(2,6,23,0.12)] backdrop-blur-sm sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Upload Your Document
          </h2>
          <p className="text-sm text-muted-foreground">
            Add one PDF to build your private knowledge base for grounded chat.
          </p>
        </div>

        {/* File upload widget */}
        <Pattern
          accept="application/pdf"
          multiple={false}
          maxFiles={1}
          maxSize={50 * 1024 * 1024}
          simulateUpload={false}
          onFilesChange={handleFilesChange}
          className="w-full"
        />

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Stepper — appears once a file is selected */}
        {step !== "idle" && (
          <Stepper
            value={stepValue}
            orientation="horizontal"
            indicators={{
              loading: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
              completed: <Check className="h-3.5 w-3.5" />,
              active: <span className="h-2 w-2 rounded-full bg-primary" />,
            }}
          >
            <StepperNav>
              {STEPS.map((s, i) => (
                <StepperItem
                  key={s.step}
                  step={s.step}
                  loading={
                    (s.step === 1 && step === "uploading") ||
                    (s.step === 2 && step === "processing")
                  }
                  completed={
                    (s.step === 1 && (step === "processing" || step === "done")) ||
                    (s.step === 2 && step === "done") ||
                    (s.step === 3 && step === "done")
                  }
                >
                  <StepperTrigger className="flex w-full cursor-default items-center gap-3 py-1">
                    <StepperIndicator className="size-7 shrink-0 text-xs" />
                    <div className="text-left">
                      <StepperTitle className="text-sm font-medium text-foreground">
                        {s.title}
                      </StepperTitle>
                      <StepperDescription className="text-xs text-muted-foreground">
                        {s.desc}
                      </StepperDescription>
                    </div>
                  </StepperTrigger>
                  {i < STEPS.length - 1 && <StepperSeparator className="ms-3.5" />}
                </StepperItem>
              ))}
            </StepperNav>
          </Stepper>
        )}

        {/* Continue button appears when done */}
        {step === "done" && (
          <button
            onClick={() => navigate("/Chat")}
            className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Continue to Chat →
          </button>
        )}
      </div>
    </div>
  )
}

export default UploadDoc