import { useNavigate } from "react-router-dom"
import { Zap, ArrowRight, ShieldCheck } from "lucide-react"

export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow blob */}
      <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-175 h-100 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-24 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-7">
          <Zap className="w-3 h-3" /> Powered by RAG AI
        </div>

        <h1 className="text-[3.25rem] md:text-[4rem] font-extrabold tracking-tight text-gray-950 leading-[1.1] mb-5">
          Understand any document,{" "}
          <span className="text-blue-600">instantly.</span>
        </h1>

        <p className="text-[1.05rem] text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
          Upload a PDF or book, and have a real conversation with it.
          Powered by AI — no account required to get started.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
          <button
            onClick={() => navigate("/UploadDoc")}
            className="group relative flex items-center gap-2.5 px-9 py-4 bg-blue-600 text-white text-[15px] font-bold rounded-2xl hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-200 ring-2 ring-blue-400/30 hover:ring-blue-400/60 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="absolute -inset-0.5 rounded-2xl bg-blue-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <Zap className="w-4 h-4 fill-white" />
            Continue as Guest
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
          </button>
          <button
            onClick={() => navigate("/Login")}
            className="flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 text-[14px] font-semibold rounded-2xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Sign in to your account
          </button>
        </div>

        <p className="text-[11.5px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          Guest sessions are private and auto-deleted after use.
        </p>
      </div>
    </section>
  )
}
