import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pattern } from "@/components/patterns/p-file-upload-5"
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
import { Check, Loader2 } from "lucide-react"

const STEPS = [
  { step: 1, title: "Uploading", desc: "Sending your PDF to the server" },
  { step: 2, title: "Processing", desc: "Extracting and indexing content" },
  { step: 3, title: "Ready", desc: "Your document is ready to chat" },
]

function UploadDoc() {
  const navigate = useNavigate()
  const [step, setStep] = useState<"idle" | "uploading" | "processing" | "done">("idle")

  const handleFilesChange = (files: FileWithPreview[]) => {
    if (files.length === 0) {
      setStep("idle")
      return
    }
    setStep("uploading")
    setTimeout(() => setStep("processing"), 2000)
    setTimeout(() => setStep("done"), 4500)
  }

  const stepValue =
    step === "uploading" ? 1 : step === "processing" ? 2 : step === "done" ? 3 : 0

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-black to-neutral-900 p-6">
      <div className="bg-neutral-900 rounded-2xl shadow-xl p-10 w-full max-w-2xl flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-white">Upload Your Document</h2>

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

        {/* Stepper — appears once a file is selected */}
        {step !== "idle" && (
          <Stepper
            value={stepValue}
            orientation="horizontal"
            indicators={{
              loading: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
              completed: <Check className="h-3.5 w-3.5" />,
              active: <span className="h-2 w-2 rounded-full bg-white" />,
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
                      <StepperTitle className="text-sm font-medium text-zinc-200">
                        {s.title}
                      </StepperTitle>
                      <StepperDescription className="text-xs text-zinc-500">
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
            className="w-full px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition"
          >
            Continue to Chat →
          </button>
        )}
      </div>
    </div>
  )
}

export default UploadDoc