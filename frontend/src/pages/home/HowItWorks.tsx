const STEPS = [
  {
    step: "01",
    title: "Upload your document",
    desc: "Drop a PDF — we extract, chunk, and embed the entire content into a vector store.",
  },
  {
    step: "02",
    title: "Instant indexing",
    desc: "Your document is processed via RAG and stored in an isolated session database.",
  },
  {
    step: "03",
    title: "Ask anything",
    desc: "Get precise, sourced answers from your document — like having a personal expert.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-3">How it works</p>
        <h2 className="text-3xl font-bold tracking-tight mb-14">From upload to insight in seconds</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {STEPS.map((s) => (
            <div key={s.step} className="relative pl-5 border-l border-gray-700">
              <span className="block text-5xl font-black text-gray-800 mb-1 select-none">{s.step}</span>
              <h3 className="text-[15px] font-semibold text-white mb-1.5">{s.title}</h3>
              <p className="text-[13.5px] text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
