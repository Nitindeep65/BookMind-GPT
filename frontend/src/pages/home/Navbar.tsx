import { useNavigate } from "react-router-dom"
import { FileUp, MessageSquare, ScanText, Upload, Cpu, HelpCircle, Mail, Github, Twitter } from "lucide-react"

const NAV_LINKS = [
  {
    label: "Features",
    href: "#features",
    dropdown: [
      { icon: <FileUp className="w-3.5 h-3.5" />, label: "Upload Any PDF", desc: "Books, papers, docs up to 300 pages", href: "#features" },
      { icon: <MessageSquare className="w-3.5 h-3.5" />, label: "Chat with Your Doc", desc: "Context-aware answers with citations", href: "#features" },
      { icon: <ScanText className="w-3.5 h-3.5" />, label: "RAG-Powered Accuracy", desc: "Answers from your doc, not hallucinations", href: "#features" },
    ],
  },
  {
    label: "How it works",
    href: "#how-it-works",
    dropdown: [
      { icon: <Upload className="w-3.5 h-3.5" />, label: "Upload your document", desc: "Drop a PDF and we handle ingestion", href: "#how-it-works" },
      { icon: <Cpu className="w-3.5 h-3.5" />, label: "Instant indexing", desc: "Processed & stored in your session", href: "#how-it-works" },
      { icon: <HelpCircle className="w-3.5 h-3.5" />, label: "Ask anything", desc: "Precise, sourced answers from your file", href: "#how-it-works" },
    ],
  },
  {
    label: "Contact",
    href: "#footer",
    dropdown: [
      { icon: <Mail className="w-3.5 h-3.5" />, label: "Email Us", desc: "hello@easyread.app", href: "mailto:hello@easyread.app" },
      { icon: <Github className="w-3.5 h-3.5" />, label: "GitHub", desc: "View source & contribute", href: "#" },
      { icon: <Twitter className="w-3.5 h-3.5" />, label: "Twitter", desc: "Follow us for updates", href: "#" },
    ],
  },
]

export function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="BookMind GPT" className="w-10 h-10 rounded-lg object-contain" />
          <span className="font-semibold text-[15px] tracking-tight text-gray-900">BookMind GPT</span>
        </div>

        {/* Nav Links with hover dropdowns */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-gray-500">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative group">
              <a
                href={link.href}
                className="flex items-center gap-1 py-1 hover:text-gray-900 transition-colors duration-150"
              >
                {link.label}
                <svg className="w-3 h-3 mt-px transition-transform duration-150 group-hover:rotate-180" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* Dropdown panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 translate-y-1 group-hover:translate-y-0">
                <div className="w-64 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-100/80 py-2 overflow-hidden">
                  {/* Arrow */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
                  {link.dropdown.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-100 group/item"
                    >
                      <span className="mt-0.5 text-blue-500 group-hover/item:text-blue-600 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 leading-snug">{item.label}</p>
                        <p className="text-[11.5px] text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/Login")}
            className="text-[13.5px] font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 hidden sm:block"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/UploadDoc")}
            className="text-[13.5px] font-semibold px-4 py-1.75 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  )
}
