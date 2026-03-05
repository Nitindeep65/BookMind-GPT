import { FileUp, MessageSquare, ScanText } from "lucide-react"

const FEATURES = [
  {
    icon: <FileUp className="w-5 h-5 text-blue-600" />,
    title: "Upload Any PDF",
    desc: "Support for books, research papers, and documents up to 300 pages. Fast ingestion, zero friction.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
    title: "Chat with Your Doc",
    desc: "Ask precise questions and get context-aware answers with page-level citations sourced from your file.",
  },
  {
    icon: <ScanText className="w-5 h-5 text-blue-600" />,
    title: "RAG-Powered Accuracy",
    desc: "Retrieval-Augmented Generation ensures answers come from your document — not hallucinated facts.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">Features</p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Built for deep reading</h2>
          <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">
            Everything you need to extract knowledge from long documents — fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 bg-white"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="font-semibold text-[15px] text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-[13.5px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
